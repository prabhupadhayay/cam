const axios = require('axios')
cheerio = require('cheerio')
fs = require('fs')

async function get_online_models() {
    let url = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=CGTdY'
    let data;

    await axios.get(url)
        .then(response => {
            data = response.data;
        })
        .catch(e => {
            console.log('Error while fetching online models error ' + e)
        })
    return data
    
}

async function scrap_model_html(username) {

    let url = 'https://chaturbate.com/' + username
    let data;

    await axios.get(url)
        .then(response => {
            data = response.data;
        })
        .catch(e => {
            console.log('Error while fetching online models, cause : ' + e)
        })
        
       // console.log(data)
       //response.send(data);
    return data
    
}

async function fetch_media_items($) {

    var media = [];
    try {
        $('.user_upload').each(function (i) {
            var item = {};
            item.mediaTitle = $(this).find('.title').text();
            item.previewUrl = $(this).find('.title').prev('.preview').attr('src');
            item.lockUrl = 'https://ssl-ccstatic.highwebmedia.com/images/locked_rectangle4.png';
            item.forSale = Boolean($(this).find('.thumbnail_label_tokens').length);
            item.mediaType = ($(this).find('img').attr('alt') == 'Video' ? 1 : 0);
            item.freeForFanClub = $(this).find('.thumbnail_label_tokens').text().includes('FAN');
            item.tokenPrice = $(this).find('.thumbnail_label_tokens').text().split('TOKENS')[0].replace(/[\n\r]/g, '');
            media.push(item);
        })
    } catch (e) {
        console.log('Failed to fetch about us images cause ' + e);
    }
    return media;
}

async function fetch_about_us_images($) {

    var images = [];
    try {
        $(":contains('About Me')").next('dd').find('img').each(function (i) {
            var image = {};
            image.imageUrl = $(this).attr('src');
            images.push(image);
        })
    } catch (e) {
        console.log('Failed to fetch about us images cause ' + e);
    }
    return images;
}

async function loop_over_social_media(media_links, media_type, PlatformId, keyword, $) {

    if (media_type == 'email') {

        var emails = $('html').html().match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);

        if (typeof (emails) !== 'undefined' && emails != null && emails.length != 0) {
            for (email in emails) {
                if (emails[email] != 'support@chaturbate.com') {
                    var media = {};
                    media.platformId = PlatformId;
                    media.handleOrUrl = emails[email];
                    media_links.push(media);
                }
            }
        }
        return media_links;
    } else {

        try {

            if ($("a[href*='" + keyword + "']").length == 0) {
                return media_links;
            }

            var check_duplicates = [];

            $("a[href*='" + keyword + "']").each(function (i) {
                var media = {};
                var handleOrUrl = decodeURIComponent($("a[href*='" + keyword + "']").attr('href').split('=')[1]);

                if (!check_duplicates.includes(handleOrUrl)) {
                    media.handleOrUrl = decodeURIComponent($("a[href*='" + keyword + "']").attr('href').split('=')[1]);
                    media.platformId = PlatformId;
                    media_links.push(media);
                    check_duplicates.push(media.handleOrUrl);
                }
            })
        } catch (e) {
            console.log('Failed to fetch about us images cause ' + e);
        }
        return media_links;
    }

}

async function fetch_social_media_links($) {

    media_links = [];

    loop_over_social_media(media_links, 'pornhub', 2, 'pornhub', $)
    loop_over_social_media(media_links, 'facebook', 3, 'facebook', $)
    loop_over_social_media(media_links, 'facebook', 3, 'fb.com', $)
    loop_over_social_media(media_links, 'amazon', 4, 'amazon', $)
    loop_over_social_media(media_links, 'amazon', 4, 'amazn', $)
    loop_over_social_media(media_links, 'amazon', 4, 'a.co%2F', $)
    loop_over_social_media(media_links, 'manyvids', 5, 'is.gd', $)
    loop_over_social_media(media_links, 'manyvids', 5, 'manyvids', $)
    loop_over_social_media(media_links, 'twitter', 6, 'twitter.com', $)
    loop_over_social_media(media_links, 'kik', 7, 'kik', $)
    loop_over_social_media(media_links, 'instagram', 8, 'instagram', $)
    loop_over_social_media(media_links, 'onlyfans', 9, 'onlyfans', $)
    loop_over_social_media(media_links, 'cambased', 10, 'cambased', $)
    loop_over_social_media(media_links, 'modelcentro', 11, 'modelcentro', $)
    loop_over_social_media(media_links, 'email', 12, 'email', $)
    loop_over_social_media(media_links, 'fancentro', 13, 'fancentro', $)
    loop_over_social_media(media_links, 'reddit', 14, 'reddit', $)

    return media_links;

}
/**
 * Parse raw HTML and geneate JS Objects
 * @param {String} token 
 * @param {String} html 
 */
async function parse_html(model_user_name, html) {

    var url = 'https://chaturbate.com/';
    try {
        data = [];
        const $ = cheerio.load(html);

        var obj = {}

        obj.username = model_user_name;

        obj.socialProfiles = fetch_social_media_links($);

        obj.wishListText = $(":contains('Wish List:')").next('dd').html();
        obj.wishlist = '';
        obj.interestedIn = $(":contains('Interested In')").next('dd').text();
        obj.bodyType = $(":contains('Body Type')").next('dd').text();
        obj.smokeDrink = $(":contains('Smoke')").next('dd').text();
        obj.bodyDecoration = $(":contains('Body Decorations')").next('dd').text();
        obj.aboutText = $(":contains('About Me')").next('dd').text();
        obj.aboutImageItems = fetch_about_us_images($);
        obj.mediaItems = fetch_media_items($);
        data.push(obj);

    } catch (e) {
        console.log(e);
    }
    return data;
}

/**
 * POST data to remote API
 */
// function post_to_api() {
//     const api_url = 'http://3.88.83.158:81/api/chaturbateBio/createList';

//     axios.post(api_url,data)
//         .then(function(response){
//             if(response.status === 200) {
//                 //console.log(response)
//             console.log('Success from API');
//             }
//         })
//         .catch(function(error){
//             console.log('Error while posting to API : ' + error)
//         });
// }

/**
 * Bootstrap method to initialize crawler
 */
async function main(req,res) {

    var model_page_html = '';
    var parsed_bio = '';

    try {
        let online_models_dump = await get_online_models();
        var i = 1;

        for (model in online_models_dump) {
            model_user_name = online_models_dump[model]['username']
            model_page_html = await scrap_model_html(model_user_name);
            parsed_bio = await parse_html(model_user_name, model_page_html);
            //post_to_api(parsed_bio);
            console.log(i + ' From total ' + online_models_dump.length);
            console.log('--------------------');
            console.log(parsed_bio)
            //res.json(parsed_bio)
            i++;
        }

    } catch (e) {
        console.log(e)
    }
}

exports.createList = async function (req, res) {
    main();
};