# VisCode

This is the source repository for the VS Code extension VisCode. 

## Features

Visualizes the current code open on your active code editor on VS Code. The visualizations will be displayed on a panel adjacent to your editor.

Works for Python and Java.

## Usage

### Instructions for running the extension:
* Open the Python / Java file which you want to visualize
* Ensure the file has been saved
* Open the command palette (`Cmd+Shift+P` on macOS or `Ctrl+Shift+P` on Windows)
* Select the command "Visualize current code"
* To rerun the visualizer, navigate back to the Python / Java code file, save it and run the command again

### If your program takes in user inputs
* Add the inputs you wish to enter in a separate .txt file in the same directory as your program
* The inputs should be separated by a newline (`\n`) or an Enter
* Save the .txt file
* Upon running the visualizer command, enter the name of the input file, including the .txt extension

### Visualization Features
* Press the 'Prev' and 'Next' buttons to navigate between execution steps
* The corresponding line of code that was executed to create the visualization will be highlighted in the code editor 
* Console outputs are displayed in the text box in the bottom right corner
* Class diagrams are drawn in the 'Class Diagram' tab in the top right, while the main visualization resides in the 'Trace Diagram' tab in the top left
* To download the visualization as an HTML document, press the 'Download' button

Note: Only single files are supported, a project consisting of multiple files cannot be visualized.

## Release Notes

### 0.0.1

Initial release of VisCode for User Acceptance Testing

### 0.0.2

Added user input handling

### 0.0.3 to 0.0.8

Minor bug fixes