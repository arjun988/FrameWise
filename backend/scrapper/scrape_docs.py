import requests
from bs4 import BeautifulSoup
import re
import time
import logging
from collections import deque
from fake_useragent import UserAgent
from urllib.parse import urljoin, urlparse
import random

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class WebsiteScraper:
    def __init__(self, start_url, max_pages=100, max_depth=5):
        self.start_url = start_url
        self.max_pages = max_pages
        self.max_depth = max_depth
        self.seen_urls = set()
        self.scraped_count = 0
        self.session = requests.Session()
        self.ua = UserAgent()
        self.headers = {'User-Agent': self.ua.random}

    def fetch_url(self, url):
        try:
            response = self.session.get(url, headers={'User-Agent': self.ua.random}, timeout=10)
            response.raise_for_status()
            return response.text
        except Exception as e:
            logging.error(f"Error fetching {url}: {e}")
            return None

    def extract_links(self, soup, base_url):
        links = set()
        for link in soup.find_all('a', href=True):
            href = link['href']
            if href.startswith('/'):
                href = urljoin(base_url, href)
            parsed_href = urlparse(href)
            if parsed_href.netloc == urlparse(base_url).netloc:
                links.add(href)
        return links

    def extract_images(self, soup):
        return [img['src'] for img in soup.find_all('img') if img.has_attr('src')]

    def extract_metadata(self, soup):
        title = soup.title.string if soup.title else ""
        description = soup.find('meta', attrs={'name': 'description'})
        return {
            'title': title,
            'description': description['content'] if description else "",
            'keywords': soup.find('meta', attrs={'name': 'keywords'})['content'] if soup.find('meta', attrs={'name': 'keywords'}) else ""
        }

    def scrape_page(self, url):
        html = self.fetch_url(url)
        if not html:
            return None
        
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove all script and style elements
        for script in soup(["script", "style"]):
            script.decompose()

        # Get all visible text
        raw_text = soup.get_text()
        lines = (line.strip() for line in raw_text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text_content = '\n'.join(chunk for chunk in chunks if chunk)

        # Extract numbers and dates
        numbers_and_dates = re.findall(r'\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Za-z]{3,9} \d{1,2}, \d{4}', text_content)
        emails = re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', text_content)
        phones = re.findall(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b', text_content)
        links = self.extract_links(soup, url)
        images = self.extract_images(soup)
        meta = self.extract_metadata(soup)

        return {
            'url': url,
            'text': text_content,
            'numbers_and_dates': numbers_and_dates,
            'emails': emails,
            'phones': phones,
            'links': list(links),
            'images': images,
            'metadata': meta,
            'soup': soup
        }

    def scrape_website(self):
        scraped_data = []
        urls_to_scrape = deque([(self.start_url, 0)])
        
        while urls_to_scrape and self.scraped_count < self.max_pages:
            url, depth = urls_to_scrape.popleft()
            
            if url in self.seen_urls or depth > self.max_depth:
                continue
            
            self.seen_urls.add(url)
            logging.info(f"Scraping {url} (depth: {depth})")

            result = self.scrape_page(url)
            if result:
                scraped_data.append(result)
                self.scraped_count += 1

                if depth < self.max_depth:
                    new_links = result['links']
                    for link in new_links:
                        if link not in self.seen_urls and len(urls_to_scrape) < self.max_pages:
                            urls_to_scrape.append((link, depth + 1))
                
                # Pause to avoid rate-limiting
                time.sleep(random.uniform(1, 3))

        return scraped_data

# Export the scraping function
def scrape(start_url, max_pages=100, max_depth=5):
    scraper = WebsiteScraper(start_url, max_pages=max_pages, max_depth=max_depth)
    return scraper.scrape_website()
