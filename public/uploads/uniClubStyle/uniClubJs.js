const settingBtn = document.querySelector('#settingToggle');
const profileMenu = document.querySelector('#profileDropdown');


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
