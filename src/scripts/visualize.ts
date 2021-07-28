import {rows} from "./data";
import * as dom from "./dom";
import {showPopup} from "./popup";
import {filterNulls, map, mean, median, stdev, unique} from "./statistics";

// Show statistics and visualizations of the user's media.
function visualizeData(): void {
  showPopup(container => {
    const heading = dom.create("h1");
    heading.textContent = "Your media";
    container.appendChild(heading);

    const description = dom.create("p");
    description.textContent = `${rows.length} items`;
    container.appendChild(description);

    const getRatings = () => filterNulls(map(row => row.rating, rows));

    const meanRating = mean(getRatings());
    if (meanRating.hasValue) {
      const meanRatingEl = dom.create("p");
      meanRatingEl.textContent = `Mean rating: ${meanRating.value}`;
      container.appendChild(meanRatingEl);
    }

    const medianRating = median(getRatings());
    if (medianRating.hasValue) {
      const medianRatingEl = dom.create("p");
      medianRatingEl.textContent = `Median rating: ${medianRating.value}`;
      container.appendChild(medianRatingEl);
    }

    const ratingsStdev = stdev(getRatings());
    if (ratingsStdev.hasValue) {
      const ratingsStdevEl = dom.create("p");
      ratingsStdevEl.textContent = `Ratings standard deviation: ${ratingsStdev.value}`;
      container.appendChild(ratingsStdevEl);
    }

    const typesEl = dom.create("p");
    const types = [...unique(map(row => row.type, rows))];
    types.sort();
    typesEl.textContent = `Media types: ${types.join(", ")}`;
    container.appendChild(typesEl);
  });
}

export {visualizeData};
