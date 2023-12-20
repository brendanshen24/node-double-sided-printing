const pdfPrinter = require("pdf-to-printer");
const fs = require('fs');
const pdf = require('pdf-page-counter');
const prompt = require('prompt-sync')();

const filePath = process.argv[2];

//const path_to_pdf = "./c.pdf"
const path_to_pdf = filePath;

const printerL = "Hewlett-Packard HP Color LaserJet CP2025dn";
const mono = true;

let dataBuffer = fs.readFileSync(path_to_pdf);

const page_order = (page_num) =>{
    let front = [];
    let back = [];

    //if(page_num % 2 == 0) {}
    let flip = false;

    for (let i = page_num; i > 0; i--) {
        if (flip == false){
            back.push(i)
            flip = true;
        }
        else{
            front.push(i)
            flip = false;
        }
    }

    const pageobj = {
        front: front,
        back : back,
    }
    return pageobj;
}

pdf(dataBuffer).then(function(data) {
    // number of pages
    const num_pages = data.numpages;
    let print_first = ''
    let print_second = ''
    if(num_pages % 2 == 0) {
        print_first = page_order(num_pages).back.reverse().join(',');
        print_second = page_order(num_pages).front.join(',');

       // console.log(back_pages)
        //console.log(front_pages)
    }
    else{
        print_first = page_order(num_pages).front.join(',');
        print_second = page_order(num_pages).back.reverse().join(',');
        //console.log(front_pages)

        //console.log(back_pages)
    }

    const options_first = {
        printer: printerL,
        pages: print_first,
        monochrome: mono,
        //printDialog: true,
    };

    pdfPrinter.print(path_to_pdf, options_first).then();

    const name = prompt('Printing back side pages of the document. Once finished, please rotate pages by 180 degrees and flip over and put back into paper tray. Once pages are back in the paper tray, and press enter to print the front side pages. ');

    const options_second = {
        printer: printerL,
        pages: print_second,
        monochrome: mono,
        //printDialog: true,
    };
    pdfPrinter.print(path_to_pdf, options_second).then();
    console.log('Done!')

    const exit = prompt('Press enter to exit. ');

});

