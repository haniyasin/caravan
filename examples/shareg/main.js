/*
 * Название рабочее, хотя и старое уже. Может и приживётся. 
 * Тестовое приложение, хотя и практически-применимое, которое демонстрирует следующие возможности 
 * каравана:
 * + полное сохранение состояния приложения. Просто сохраняете программу, выключаете компьютер, а затем
 *   включаете, восстанавливаете состояние и продолжаете работать с того места, на котором закончили. Или
 *   перенесли на другой компьютер и продолжили там.
 * + живая миграция приложения или его частей(возможность перенести работающее приложение со всем его
 *   состоянием с одного устройства(скажем компьютера) на другой(скажем смартфон). В этом случае переносятся
 *   и данные с которыми работало приложение и его состояние. Если допустим перенести плеер, проигрывающий
 *   какую-то мелодию из плейлиста, то он продолжит её проигрывать, а плейлист будет тем же.
 * + слияние, синхронизация частей разных приложений. С помощью этого механизма реализуются самые разные
 *   возможности(от объединения сообщений(разных собеседников) в одну цепочку, до объединения файлов от 
 *   разных в одну директорию(скажем фильмы какого-нибудь режисёра). Слияние одна из важнеших концепций и 
 *   частично реализованна на базе сохранения состояния и миграции, является их частным случаем. Слияние
 *   должно используется везде для взаимодействия, если возможно. Благодаря слиянию caravan приложения не
 *   требуют мгновенных способов связи(низкие задержки internet) и могут даже обойтись без интернета как 
 *   такового, взаимодействуя когда это возможно(скажем bluetooth).
 * + ui и его возможности, включая интеграцию drag and drop на различных платформах.
 * + взаимодействие в реальном времени, основанное на межсервисном посыле сообщений.
 * 
 * Приложение состоит из нескольких самостоятельных частей, которые потенциально могут быть донорами для
 * других приложений подобно тому, как capsule/examples/player стал донором плеера для этого приложения.
 * Вот эти части:
 * + player 
 *   способен воспроизводить аудио и видео, в основном построен на capsule/examples/player. Может сохранять
 *   своё состояние, мигрировать и восстанавливать. В качестве источников воспроизведение использует любой
 *   сервис, который реализует media_source интерфейс. Также реализует интерфейс player, чтобы им могли
 *   управлять другие сервисы. 
 * + lists
 *   нечто вроде плейлиста в винампе, но элементами списка могут быть любые допустимые для capsule типы.
 *   Это позволяет использовать lists как источник(ведь lists реализует media_source) для player, так и просто
 *   как способ поделиться с кем-нибудь определёнными файлами(скажем делаете список файлов, а 
 *   потом мигрируете его к кому-нибудь, ему потребуется только ссылку от вас получить).
 *   Способен сохранять своё состояние(как в целом, так и отдельных списков), мигрировать и восстанавливать.
 * + opener
 *   отвечается за открытие произвольных типов capsule, для которых нет сервисов для работы с ними. Нужно
 *   в основном для передачи данных из lists во внешние приложения(скажем с вами с помощью миграции
 *   поделились обычным rar архивом и вы его таким образом открыли с помощью winrar).
 *   Способен сохранять своё состояние, мигрировать и восстанавливать.
 */

var linker = require('caravan/init'),
shared = require('shareg/shared'),
cn,
local_services = {};

exports.init = function(_caravan){
    cn = _caravan;
    
    cn.on('state_start', function(sprout, stack, image){
	      shared.set('ui', new require('caravan/parts/ui')());

	      //loading lists if there is no presaved image(cold application start)
	      if(typeof image == 'undefined'){
		  local_services.lists = linker.get('shareg/lists');
		  local_services.lists.state_start(image).run();
	      } else {
		  //loading services with presaved images
		  for(key in image.services){
		      local_services[key] = linker.get('./' + key);
		      (local_services[key].get_interface('state')).start(image.services[key]);
		  }	    
	      }
	  });
    cn.on('state_stop', function(sprout, stack){
	  });
    cn.on('state_save', function(sprout, stack, image){
	  });
};

exports.interfaces = [];
exports.interfaces['state'] = {
    start : function(sprout, stack, image){
    },
    stop : function(){
	for(key in local_services){
	    (local_services[key].get_interface('state')).stop();
	}
    },
    save : function(sprout, stack, image){
	for(key in local_services){
	    (local_services[key].get_interface('state')).save(image);
	}
    }
};