# Photo Transpose

## Introduction
Photo transpose is a project created to simplify the visualization of testing iphone apps. It takes two images: a known screenshot and a test screenshot and tranposes them together, allowing for easier access.

## Pixel Manipulation
The first part of this project included getting image data and changing the pixels so that all the black pixels on the test screenshot were converted to known screenshot pixels. In hindsight, it would have been better to change the known screenshot's pixels to the test screenshot if the test was not black. Doing so on a canvas allowed for seamless conversion into one image.

## File Pathing
Because I needed to access folders dynamically and not just in static locations, I had to use Node for server sided access to local files. Similarly, using socket.io, I was able to transfer image data to the client by transforming the buffer data to base64. Once the client has recieved it, then it is transfered back to image data to use.

## Conclusion
In the end, the final product is able to dynamically choose which folders to access on the drive and send those images to the client for pixel manipulation. I learned file pathing and image data transfer in the project.

