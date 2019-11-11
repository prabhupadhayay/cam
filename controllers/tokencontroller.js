const axios = require('axios')
    cheerio = require('cheerio')

/** List of tokens on site */
var tokens = [6,12,18,30,60,90];    

/**
 * Generate Site URL dynamically
 * @param {String} current_page 
 * @param {Integer} token 
 */
var get_url = function(current_page,token){
    return 'https://chaturbate.com/'
            + token
            +'-tokens-per-minute-private-cams/female/?_=' 
            + Date.now()
            +'&page='
            + current_page;
}   

/**
 * Bootstrap method to initialize crawler
 */
async function main(){

    for(token of tokens){
        var current_page = 1;
        let html = await fetch_html(current_page,token);
        let total_pages = await get_total_pages(html);     
            
        if(isNaN(total_pages)){
            total_pages = 1;
        }  

        /**
         * Iterate over all the pages
         *  for selected token 
         */
        
        while(current_page <= total_pages){
            
            if(!html){
                html = await fetch_html(current_page,token) 
            }
            var objects = await parse_html(token,html);
            post_to_api(objects);
            html = ''; 
            current_page++;
        }        
    }
}

/**
 * Fetch Raw HTML from the given URL
 * @param {Integer} current_page 
 * @param {Integer} token 
 */
async function fetch_html(current_page,token){
    
    let data;
    await axios.get(get_url(current_page,token))
          .then(response => {
           data = response.data;
        }) 
        .catch(error =>{
            get_url(current_page,token) 
           console.log(error)
        })
    return data;    
}

/**
 * POST data to remote API
 */
function post_to_api(data){
    
    const api_url = 'http://3.88.83.158:81/api/chaturbateModelTokenAmnt/createList';
    
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
 * @param {String} token 
 * @param {String} html 
 */
function parse_html(token,html){

    try{
        data = [];
        const $ = cheerio.load(html);
        $('.room_list_room').each(function(i){
            var obj = {}
            obj.tokenPerMin = token;
            obj.username  = $(this).children('.details').children('.title').children('a').html().trim();
            data.push(obj);
        });
    }catch(e){
        console.log(e);
    }
    return data;
}

exports.fetchtoken = async function (req, res) {
    main();
};