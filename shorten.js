const port = 1234; 
const dbUrl = "mongodb://localhost/shorten";

const app = require('express')();
const mongoose = require('mongoose');

app.use(require('body-parser').json());

app.listen(port, () => {
	console.log(`Server started on ${port}`);
});

mongoose.connect(dbUrl);
const Link = mongoose.model('Link', new mongoose.Schema({
	id: { type: String, unique: true, index: true, default: require('nanoid').nanoid(8) },
	url: { type: String, required: true },
	
	views: { type: Number, default: 0 }
}));

db.on('error', function() {
	console.error('DB returned error:')
});

db.on('open', function() {
	console.log('Connected to the DB');

	app.post('/shorten', (req, res) => {
		if(typeof req.body.urlToShorten !== 'string') 
			return res.status(400).send('urlToShorten is required!');

		const link = new Link({url: req.body.urlToShorten});
		link.save(function (err) {
			console.log('saved');
		})
		res.status(201);
		res.send(JSON.stringify({
			status: 'Created',
			shortenedUrl: `http://localhost:${port}/${link.id}`
		}));
	});

	app.get('/:url', (req, res) => {
		Link.findOne({ id: req.params.url }, function (err, link) {
			if(!link) return res.status(404).send(JSON.stringify({
				status: 'NotFound'
			}));

			link.views++;
			link.save();

			res.status(301).location(link.url).send(JSON.stringify({
				redirectTo: link.url
			}));
		});
	});

	app.get('/:url/views', (req, res) => {
		Link.findOne({ id: req.params.url }, function (err, link) {
			if(!link) return res.status(404).send(JSON.stringify({
				status: 'NotFound'
			}));

			res.status(200);
			res.send(JSON.stringify({
				viewCount: link.views
			}));
		});
	});
});