const buttons = [
  ...document.querySelectorAll(".read-random"),
  ...document.querySelectorAll(".read-random-mobile"),
];

for (const element of buttons) {
  element.addEventListener("click", (event) => {
    const button = event.target;
    const host = location.protocol + "//" + location.host;
    const sitemapUrl = host + "/sitemap.xml";
    const targetPrefix = host + button.getAttribute("data-target-prefix");
    const excludeUrls = [`${targetPrefix}/`];

    // Fetch and process the sitemap
    fetch(sitemapUrl)
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.statusText}`);
        return response.text();
      })
      .then((sitemapXml) => {
        // Parse the XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(sitemapXml, "application/xml");

        // Extract and filter URLs
        const urls = Array.from(xmlDoc.getElementsByTagName("loc")).map(
          (loc) => loc.textContent
        );
        const filteredUrls = urls.filter(
          (url) => url.startsWith(targetPrefix) && !excludeUrls.includes(url)
        );

        // Navigate to a random URL
        if (filteredUrls.length > 0) {
          const randomUrl =
            filteredUrls[Math.floor(Math.random() * filteredUrls.length)];
          console.log(`Navigating to: ${randomUrl}`);
          window.location.href = randomUrl;
        } else {
          console.warn("No valid URLs to navigate to.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}
