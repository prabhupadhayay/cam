'use strict';

const axios = require('axios')
const express = require('express');
const cheerio = require('cheerio')
const fs = require('fs')
const router = express.Router();

router.get('/fetch_media_items', (req, res) => {
    axios.get('https://www.amazon.in/gp/product/B07TWFVDWT?pf_rd_p=649eac15-05ce-45c0-86ac-3e413b8ba3d4&pf_rd_r=SPH3S2V8RGYVNXR28G9W')
        .then((response) => {
            //  if(res.status === 200) {
                //console.log(response)
            const html = response.data;
            const $ = cheerio.load(html);
            //console.log($);
            let devtoList1 = [];
            $('.dp').each(function (i, elem) {
                devtoList1[i] = {
                    mediaTitle: $(this).find('.title').text(),
                    previewUrl: $(this).find('.title').prev('.preview').attr('src'),
                    lockUrl: 'https://ssl-ccstatic.highwebmedia.com/images/locked_rectangle4.png',
                    forSale: Boolean($(this).find('.thumbnail_label_tokens').length),
                    mediaType: ($(this).find('img').attr('alt') == 'Video' ? 1 : 0),
                    freeForFanClub: $(this).find('.thumbnail_label_tokens').text().includes('FAN'),
                    tokenPrice: $(this).find('.thumbnail_label_tokens').text().split('TOKENS')[0].replace(/[\n\r]/g, ''),
                    tags: $(this).find('.tags').text().split('#')
                        .map(tag => tag.trim())
                        .filter(function (n) {
                            return n != ""
                        })
                }
            });
            res.send(devtoList1)
             console.log(devtoList1);
            // console.log("trim");
            const devtoListTrimmed = devtoList1.filter(n => n != undefined )
            fs.writeFile('devtoList1.json',
                JSON.stringify(devtoListTrimmed, null, 4),
                (err) => console.log('File successfully written!'))
           //  }
            })
        .catch(e => {
            console.log('Error while fetching online models error ' + e)
        });
});


router.get('/fetchmodels',(req,res) =>{
    let url = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=CGTdY'
    let data;
     axios.get(url)
    .then(response => {
        data = response.data;
    })
    .catch(e => {
        console.log('Error while fetching online models error ' + e)
    })
return data
})


module.exports = router;