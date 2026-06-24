/**********************************
 * Menu Code
 * Author: Josh Ottey
 * Date: 6/24/26 @ 12:09AM EST
 *********************************/

// Get the nav menu button and animate it
const nav_button = document.getElementById("navbutton");

function smoothstepping(start, end, time) {
    return start += (end - start) * time
}

nav_button.addEventListener ("mouseover", (event) => {
    event.target.style.width = "80px";
    event.target.style.height = "80px";
    event.target.style.right = "50px";
    console.log("Nav button found: ", nav_button);
})