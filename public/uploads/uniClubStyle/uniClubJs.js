const profileImage = document.querySelector('.head img');
const profileMenu = document.querySelector('.profile');


if (profileImage && profileMenu) {
    
    profileImage.addEventListener('click', (event) => {
        event.stopPropagation();
        
        profileMenu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
        profileMenu.classList.remove('active');
    });

    profileMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}