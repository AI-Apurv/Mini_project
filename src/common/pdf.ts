import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer'
import { createTransport } from 'nodemailer';
// export async function generatePDF(data: any, name: string) {
//         console.log('inside the generate pdf');
//         const outputPath = path.join('/home/admin2/Desktop/dem/my-nest-app'); 
//         console.log('outputPath-----------------------------',);
//         const outputFilename = `invoice-${12345}.pdf`;    
//         const outputFilePath = path.join(outputPath, outputFilename);    
//         if (!fs.existsSync(outputPath)) {
//                     fs.mkdirSync(outputPath);    
//                 }    
//         const doc = new pdfkit({ autoFirstPage: true });    
//         doc.pipe(fs.createWriteStream(outputFilePath));    
//             doc.fontSize(16);    doc.font('Helvetica-Bold');      
//                 doc.text('Booking Receipt', { align: 'center' });
//                     doc.moveDown(0.5);     
//                     doc.fontSize(12);
//                     doc.font('Helvetica');      
//                     doc.text(`Hello, Mr. ${name}`, { align: 'center' });    
//                     doc.moveDown(0.5);  
//                     doc.text('Your order has been successfully placed');    
//                     doc.moveDown(); // Add some space    
//                     doc.text(`Booking ID: ${data._id}`);    
//                     doc.text(`Booking Date: ${data.bookedOn}`);    
//                     doc.text(`Check-in Date: ${data.check_in_date}`);    
//                     doc.text(`Check-out Date: ${data.check_out_date}`);    
//                     doc.end();    
//                     console.log('PDF invoice generated and saved:', outputFilePath);    
//                     return outputFilePath;
//                 }



export  async function generatePDF(data: any, name: string) 
{        const pdfDoc = new PDFDocument();        
        const pdfFileName = 'message.pdf';        
        const pdfStream = fs.createWriteStream(pdfFileName);        
        pdfDoc.pipe(pdfStream);        
       
        pdfDoc.font('Helvetica-Bold').fontSize(18).fillColor('blue');        
        pdfDoc.text('Flat Booking Confirmation', { align: 'center' }); 

        pdfDoc.moveDown(1);        
        pdfDoc.fontSize(12).fillColor('black');        
        pdfDoc.text(data); 

        pdfDoc.end();  

        pdfStream.on('error', (error) => {            
            console.error('Error creating PDF:', error);        
        });      

        pdfStream.on('finish', async () => {
                        console.log(`PDF created: ${pdfFileName}`);   
                        const transporter = createTransport({
                            service: 'gmail',
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: {
                              user: 'ajpatel5848@gmail.com',
                              pass: 'eabbxcqraimxltzf' ,
                            },
                          });       
                        
                        const mailOptions = {  
                            from:'ajpatel5848@gmail.com'   ,           
                            to: name, 

                            subject: 'Flat Booking Confirmation\n\n',                
                            text: 'Dear Customer,\n\nAttached is the PDF report confirming your flat booking. Congratulations on your new home!\n\nBest regards,\nAbhijeet Groups of Industries.',                
                            // text: 'Dear Customer,\n\nAttached is the PDF report confirming your flat booking. Congratulations on your new home!\n\nBest regards,\nAbhijeet Groups of Industries',
                            attachments: [                    
                                {                        
                                    filename: pdfFileName,                        
                                    path: pdfFileName,                    
                                },                
                            ],            
                        };            
                                   
                            await transporter.sendMail(mailOptions);                
                          
                    });    
                }

