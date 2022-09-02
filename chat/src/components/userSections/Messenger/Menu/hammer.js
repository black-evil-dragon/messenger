import Hammer, { Swipe, DIRECTION_HORIZONTAL } from 'hammerjs';


const onSwipe = new Hammer(document.body, {
    enable: true,
    recognizers: [
        [Swipe, { direction: DIRECTION_HORIZONTAL }]
    ]
});

onSwipe.on('swipeleft swiperight', function (event) {
    event.preventDefault();

    if (event.type === 'swiperight') {
        document.querySelector('.messenger__content') && document.querySelector('.messenger__content').classList.remove('hidden')
    } else {
        // close/hide menu
        document.querySelector('.messenger__content') && document.querySelector('.messenger__content').classList.add('hidden')
    }

});

/*
.style.transform = `translateX(${event.distance})`
    const openMenu = () => {
        const panel = document.querySelector('.chat-list')
        panel.classList.toggle('open')

        if (panel.style.maxWidth) {
            panel.style.maxWidth = null
        } else {
            panel.style.width = '100%'
            panel.style.maxWidth = `${panel.scrollWidth}px`
        }
    }
    */