// pl-scraper.js

const axios = require('axios');
const cheerio = require('cheerio');
const mysql = require('mysql');

const url = 'https://www.premierleague.com/stats/top/players/goals?se=-1&cl=-1&iso=-1&po=-1?se=-1';

// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Password',
    database: 'pl_scorers'
});

axios(url)
.then(response => {
	const html = response.data;
    const $ = cheerio.load(html)
    const statsTable = $('.statsTableContainer > tr');
    const topPremierLeagueScorers = [];
		
	mc.connect(function(err) {
		if (err) throw err;
			console.log("Connected!");

			statsTable.each(function () {
				let player = [];
				const rank = parseInt($(this).find('.rank > strong').text());
				player.push(rank);
			  	const playerName = $(this).find('.playerName > strong').text();
				player.push(playerName);
			  	const nationality = $(this).find('.playerCountry').text();
				player.push(nationality);
			  	const goals = parseInt($(this).find('.mainStat').text());
				player.push(goals);
			
				let sql = `INSERT INTO top_scorers(rank, name, nationality, goals) VALUES(?,?,?,?)`;

				mc.query(sql, player, function (err, result, fields) {
					if (err) throw err;
						console.log("1 record inserted");
				});
				
		 	});
			
    	});

})
.catch(console.error);