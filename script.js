document.addEventListener('DOMContentLoaded', () => {
    const gridView = document.getElementById('topic-grid');
    const detailView = document.getElementById('detail-view');
    const topicTitle = document.getElementById('topic-title');
    const linksList = document.getElementById('links-list');
    const backBtn = document.getElementById('back-btn');
    const header = document.querySelector('header');

    let topicsData = [];

    // Fetch data from external JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            topicsData = data;
            renderGrid(topicsData);
        })
        .catch(error => console.error('Error loading data:', error));

    // Render the Grid of Topics
    function renderGrid(data) {
        gridView.innerHTML = '';
        data.forEach(topic => {
            const card = document.createElement('div');
            card.classList.add('topic-card');
            
            // Set background image (assumes images/{id}.webp)
            // We use a linear gradient overlay to ensure text readability
            const imagePath = `images/${topic.id}.webp`;
            // Radial gradient: darker in center (0.6) for text readability, lighter at edges (0.3)
            card.style.backgroundImage = `radial-gradient(circle, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 100%), url('${imagePath}')`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';

            const title = document.createElement('span');
            title.textContent = topic.title;
            card.appendChild(title);

            if (topic.subtitle) {
                const subtitle = document.createElement('span');
                subtitle.classList.add('topic-subtitle');
                subtitle.textContent = topic.subtitle;
                card.appendChild(subtitle);
            }

            card.addEventListener('click', () => showTopicDetails(topic));
            gridView.appendChild(card);
        });
    }

    // Show Details for a Specific Topic
    function showTopicDetails(topic) {
        // Populate Data
        topicTitle.textContent = topic.title;
        
        // You might want to show subtitle in the detail header too
        if (topic.subtitle) {
             topicTitle.innerHTML = `${topic.title} <small style="font-size: 0.6em; color: #666; display:block; margin-top:5px;">${topic.subtitle}</small>`;
        }

        linksList.innerHTML = '';

        topic.links.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            
            // Split title string by " – " (en-dash)
            // Expected format: "Title – Author – Source"
            const parts = link.title.split(' – ');
            
            if (parts.length >= 3) {
                 // We have at least 3 parts, assume Title, Author, Source
                 // If more than 3, we join the first parts as title (in case title has en-dash)
                 // But simplistic approach: take last as Source, second to last as Author, rest as Title
                 const source = parts.pop();
                 const author = parts.pop();
                 const titleText = parts.join(' – ');

                 a.innerHTML = `
                    <span class="article-source">${source}</span>
                    <span class="article-title">${titleText}</span>
                    <span class="article-author">${author}</span>
                 `;
            } else if (parts.length === 2) {
                 // Just Title and Author/Source? Try to handle gracefully
                 const secondPart = parts.pop();
                 const titleText = parts.join(' – ');
                 a.innerHTML = `
                    <span class="article-source">${secondPart}</span>
                    <span class="article-title">${titleText}</span>
                 `;
            } else {
                // Fallback
                a.innerHTML = `<span class="article-title">${link.title}</span>`;
            }

            a.target = "_blank"; // Open in new tab
            li.appendChild(a);
            linksList.appendChild(li);
        });

        // Switch Views
        gridView.classList.add('hidden');
        header.classList.add('hidden'); // Optional: hide header in detail view for cleaner look
        detailView.classList.remove('hidden');
    }

    // Back Button Logic
    backBtn.addEventListener('click', () => {
        detailView.classList.add('hidden');
        gridView.classList.remove('hidden');
        header.classList.remove('hidden');
    });
});
