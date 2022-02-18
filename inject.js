console.log("ManaInjector injected");

var WIDTH = 30
var HEIGHT = 110
var PADDING = 10
var OPACITY = 0.7
var FONT_SIZE = 15
var RETRY_WAIT = 100

// Temporary elements
var element
var new_image
var temp_canvas = document.createElement("canvas")
temp_canvas.width = WIDTH
temp_canvas.height = HEIGHT
var temp_div = document.createElement("div")
temp_div.style.position = "absolute"
temp_div.style.zIndex = 1000
temp_div.style.id = "HIDDEN_TEXT"
temp_div.style.opacity = OPACITY
temp_div.style.writingMode = "vertical-rl"
temp_div.style.fontSize = FONT_SIZE
temp_div.width = WIDTH
temp_div.height = HEIGHT
var element_rect
var parent_rect
var image_x
var image_y
var parent_x
var parent_y

// Changes text after clipboard is updated
function set_text() {
    navigator.clipboard.readText().then(text => {
        if (text != "") {
            temp_div.innerHTML = text
            element.parentElement.appendChild(temp_div)
        } else {
            setTimeout(function(){
                set_text()
            }, RETRY_WAIT);
        }
    })
}

document.onmousedown = function (e) {
    element = document.elementFromPoint(e.clientX, e.clientY)
    if (element instanceof HTMLCanvasElement) {
        element_rect = e.target.getBoundingClientRect()
        parent_rect = element.parentElement.getBoundingClientRect()

        // Calculate position relative to element (image)
        image_x = e.clientX - element_rect.left
        image_y = e.clientY - element_rect.top

        // Calculate position relative to parent
        parent_x = e.clientX - parent_rect.left - PADDING
        parent_y = e.clientY - parent_rect.top - PADDING

        // Clear old results
        navigator.clipboard.writeText("").then()
        temp_div.innerHTML = ""

        // Copy cropped image to clipboard
        // TODO: Potentially put into monitored folder instead (for Linux support)
        new_image = element.getContext("2d").getImageData(image_x - PADDING, image_y - PADDING, WIDTH, HEIGHT)
        temp_canvas.getContext("2d").putImageData(new_image, 0, 0)
        temp_canvas.toBlob(blob => navigator.clipboard.write([new ClipboardItem({"image/png": blob})]))

        // Set div position for new text
        temp_div.style.left = parent_x + "px"
        temp_div.style.top = parent_y + "px"

        // Add hiden text
        set_text()

        // Reset is pressed        
        is_pressed = false
    }
}
