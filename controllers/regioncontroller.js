const axios = require('axios')
    cheerio = require('cheerio')

/** List of regions on site */
var regions = [
                'north-american-cams',
                'other-region-cams',
                'euro-russian-cams',
                'asian-cams',
                'south-american-cams'
            ];    

/**
 * Generate Site URL dynamically
 * @param {String} current_page 
 * @param {Integer} region 
 */
var get_url = function(current_page,region){
    return 'https://chaturbate.com/'
            + region
            +'/?_=' 
            + Date.now()
            +'&page='
            + current_page;
}   

/**
 * Fetch Raw HTML from the given URL
 * @param {Integer} current_page 
 * @param {Integer} token 
 */
async function fetch_html(current_page,region){
    
    let data;
    await axios.get(get_url(current_page,region))
          .then(response => {
           data = response.data;
        }) 
        .catch(error =>{
            get_url(current_page,region) 
           console.log(error)
        })
    return data;    
}

/**
 * POST data to remote API
 */
function post_to_api(data){
    
    const api_url = 'http://3.88.83.158:81/api/chaturbateLocationRecord/createList';
    
    axios.post(api_url,data)
        .then(function(response){
            console.log('Success from API');
        })
        .catch(function(error){
            console.log('Error while posting to API : ' + error)
        });
}

/**
 * Find total pages to scrap
 * @param {String} html 
 */
function get_total_pages(html){

    try{
        const $ = cheerio.load(html); 
        return parseInt($('.paging').children('li').last().prev().children('a').text());
    }catch(e){
        console.log(e)
    }  
}

/**
 * Parse raw HTML and geneate JS Objects
 * @param {String} region 
 * @param {String} html 
 */
function parse_html(region,html){
    console.log(region);
    try{
        data = [];
        const $ = cheerio.load(html);
        $('.room_list_room').each(function(i){
            var obj = {}
            obj.ChaturbateRegionId = region;
            obj.username  = $(this).children('.details').children('.title').children('a').html().trim();
            data.push(obj);
        });
    }catch(e){
        console.log(e);
    }
    return data;
}

/**
 * Bootstrap method to initialize crawler
 */
async function main(req,res){
    var i = 0;
    for(region of regions){
        var current_page = 1;
        let html = await fetch_html(current_page,region); 
        let total_pages = await get_total_pages(html);     
        // res.send(html);   
        if(isNaN(total_pages)){
            total_pages = 1;
        }  

        /**
         * Iterate over all the pages
         *  for selected region 
         */
        
        while(current_page <= total_pages){
            
            if(!html){
                html = await fetch_html(current_page,region) 
            }
            var objects = await parse_html(i + 2,html);
            post_to_api(objects);
            html = ''; 
            current_page++;
        }
        i++;        
    }
}
exports.fetchregion = async function (req, res) {
    main();
};