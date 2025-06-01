document.getElementById('menu-btn').addEventListener('click', function() {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    
    if(window.innerWidth <= 1023) {
        sidebar.classList.toggle('active');
        content.classList.toggle('shifted');
    } else {
        sidebar.classList.toggle('desktop-hidden');
        content.classList.toggle('desktop-shifted');
    }
});
document.querySelectorAll('#sidebar ul li a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('#sidebar ul li').forEach(item => {
            item.classList.remove('active');
        });
        this.parentElement.classList.add('active');
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const pageId = this.getAttribute('data-page');
        document.getElementById(pageId).classList.add('active');
        if(window.innerWidth <= 1023) {
            document.getElementById('sidebar').classList.remove('active');
            document.getElementById('content').classList.remove('shifted');
        }
    });
});
if(window.location.hash) {
    const pageId = window.location.hash.substring(1);
    const menuItem = document.querySelector(`#sidebar a[data-page="${pageId}"]`);
    if(menuItem) {
        menuItem.click();
    }
}