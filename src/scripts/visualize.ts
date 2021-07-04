import {rows} from "./data";
import * as dom from "./dom";
import {showPopup} from "./popup";
import {filterNulls, map, mean, median} from "./statistics";

function visualizeData(): void {
  showPopup(container => {
    const heading = dom.create("h1");
    heading.textContent = "Your media";
    container.appendChild(heading);

    const description = dom.create("p");
    description.textContent = `${rows.length} items`;
    container.appendChild(description);

    const getRatings = () => filterNulls(map(row => row.rating, rows));
    const meanRatingEl = dom.create("p");
    const meanRating = mean(getRatings());
    if (meanRating.hasValue) {
      meanRatingEl.textContent = `Mean rating: ${meanRating.value}`;
      container.appendChild(meanRatingEl);
    }

    const medianRatingEl = dom.create("p");
    const medianRating = median(getRatings());
    if (medianRating.hasValue) {
      medianRatingEl.textContent = `Median rating: ${medianRating.value}`;
      container.appendChild(medianRatingEl);
    }
  });
}

export {visualizeData};
