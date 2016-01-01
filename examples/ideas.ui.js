/*
 * концепция нового ui
 * Это дополнение к тому что есть, и рассматривать данную концепцию как нечто принципиально новое нельзя.
 * Более того, многие из этих идей уже давно были в моей голове или где-то ещё. Так просто ещё одна ревизия.
 * Начнём с того, что весь ui теперь можно будет набросать мышью по принципу wysiwyg. Сам редактор будет
 * частью приложния, если это необходимо либо просто вызываться отдельно.
 * Начнём с редактора. Состоит из:
 * + холст. То куда накидывать элементы, имеет неограченный размер.
 * + панель элементов. Отсюда берём нужные элементы, кидаем их на холст.
 * + панель инструментов. Простейшая панель, содержащая простые инструменты вроде гаечного ключа, клацая
 *   которым по элементу на холсте можно его изменять. Возможно эта панель вообще будет отсутствовать:)
 * + элементы. Каждый элемент это в общем случае модуль, которые содержит логику элемента или ссылается на
 *   неё(допустим если это встроенный элемент вроде button из Compositer) и логику настройки элемента(форма,
 *   которая возникает при клацании гаечным ключом). Каждый элемент можно перетащить. В общем привет делфи.
 * Ничего такого особенного в редакторе нет, разве что то, что составляемый ui сразу готов к использованию.
 * Нужно только убрать гаечный ключ и вперёд, пользуйте.
 * 
 * Новые элементы можно добавлять просто написав модули для них. По сути разработка приложения будет стоять
 * из написания блоков приложения и затем написания блоков, с которыми взаимодействует пользователь и их
 * размещения с помощью редактора. В редакторе уже надо будет учитывать как хорошо работать будет на разных
 * дисплеях и тд.
 * 
 * Из новых элементов, которые додумал за последнее время и которые пригодятся как в различных приложениях,   * так и на сайтах-визитках можно отметить следующие:
 * + view
 *   некоторая часть экрана, которая может отображать некоторую page. То есть view это что-то вроде div c 
 *   position fixed в понимании html.
 * + page 
 *   документ, холст. Может быть любых размеров. На него могут быть нанесены любые элементы. Если страница
 *   больше view, в котором отображается, то применяются средства прокрутки, специфичные для каждой 
 *   конкретной платформы(для смартфонов это пальцодвигание, для PC это стрелки клавиатуры и полосы прокручивания)
 * + animation
 *   различные элементы анимаций. Скорее для удобства, нежели для красоты. Чтобы обеспечить визуальность
 *   переходов.
 */

/*
 * небольшой пример страницы-визитки
 */
    var vmenu = new view({ width : '100%', height : '20%' }),
    vpage = new view({ width : '100%', height : '80%'}),
    about = new page(new text({text: "мы такие классные"})),
    us_work = new page(new list(
			   new text({text: "мы делаем это"}),
			   new text({text: "то мы тоже делаем"})
			       )),
    menu_page = new page( new button({ label : 'о нас',
                                       on_click : function(){
				           vpage.set_page(about);
				       }
                                     }), 
                          new button({ label : 'что мы творим',
			               on_click : function(){
				           vpage.set_page(us_work);
				       }
			             }));
    vmenu.set_page(menu_page);

/*
 * Проба другого api
 * 
 */

page('main',
     menu({ position : 'left', width : '2i' },
	  click({ label : 'news', onClick : { page : 'news'} }),
	  click({ label : 'contacts', selected : true, onClick : { page : 'contacts' } })
	 ),
     page({ name : 'news' }, 
	  label({ text : "this is news"})),
     page({ name : 'contacts' }, 
	  label({ text : "DataUnion community" }),
	  label({ text : "Ekaterinburg sity" })
	 )
    );
