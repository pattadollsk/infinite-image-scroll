const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;

//Unsplash API
const initialImageCount = 5;
const apiKey = '-AoHq-KyVPcsA4see2AgcMBnJqHY_NDpIDW0BgkYO1s';
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialImageCount}`;

//Load more images
const addMoreImageCount = (imgCount) => {
	apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${imgCount}`;
};

//Check if all images were loaded
const imageLoaded = () => {
	imagesLoaded++;
	if (imagesLoaded === totalImages) {
		ready = true;
		loader.hidden = true;
	}
};

//Helper function for setting attributes for an element
const setAttributes = (element, attributes) => {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
};

//Create elements for photos, links, and DOM
const displayPhotos = () => {
	//Set imagesLoaded back to zero every time the function is called
	imagesLoaded = 0;
	totalImages = photosArray.length;
	//Looping through the photos
	photosArray.forEach((photo) => {
		//Create <a> element
		const item = document.createElement('a');
		setAttributes(item, {
			href: photo.links.html,
			target: '_blank'
		});
		//Create <img> element
		const img = document.createElement('img');
		setAttributes(img, {
			src: photo.urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description
		});
		//Add Event Listener to check after finished loading images
		img.addEventListener('load', imageLoaded);

		//Append <img> inside <a>, and then append inside imageContainer
		item.appendChild(img);
		imageContainer.appendChild(item);
	});
};

//Get photos from Unsplash API
async function getPhotos() {
	try {
		const fetchUrl = await fetch(apiUrl);
		photosArray = await fetchUrl.json();
		displayPhotos();
		if (initialLoad) {
			addMoreImageCount(15);
			initialLoad = false;
		}
	} catch (error) {}
}

//Scrolling
window.addEventListener('scroll', () => {
	if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
		ready = false;
		getPhotos();
	}
});

// On Load
getPhotos();
