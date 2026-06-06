import TagDetail from "@/types/TagDetail";
import React from "react";
import tagDetails from "@/utils/KeywordTagHelper";

function getParameterCaseInsensitive(
  object: { [key: string]: TagDetail },
  key: string
) {
  const asLowercase = key.toLowerCase();
  return object[
    Object.keys(object).find((k: string) => k.toLowerCase() === asLowercase) ||
      ""
  ];
}

const KeywordTags = ({ keywords }: { keywords: string[] | undefined }) => {
  const compArray = [""];
  if (JSON.stringify(keywords) == JSON.stringify(compArray)) {
    return (
      <td className="w-1/4 overflow-clip text-gray-800 dark:text-white">-</td>
    );
  } else {
    return (
      <td className="w-1/4 pr-0.5">
        <div className="gap-0.5 flex flex-wrap overflow-hidden last:pb-0.5">
          {keywords &&
            keywords
              .filter((keyword) => keyword !== "")
              .map((keyword) => {
                const match = keyword.match(/([A-Za-z\s-]+)([\d+]+)?/);

                const baseTag = match ? match[1].trim() : keyword.trim();
                const count = match && match[2] ? match[2] : "";

                const tagDetail = getParameterCaseInsensitive(
                  tagDetails,
                  baseTag
                );

                // Keywords the catalog doesn't style yet (new package entries,
                // faction-specific weapon rules) render as a neutral badge
                // rather than blocking the UI with an alert.
                if (!tagDetail) {
                  return (
                    <div
                      key={crypto.randomUUID()}
                      className="first:mt-0.5 last:mb-0.5 my-0.25 inline-flex font-semibold items-center px-1 rounded text-gray-800 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 ring-2 dark:ring-1 ring-gray-300 dark:ring-gray-600 ring-inset truncate"
                    >
                      <span className="font-semibold whitespace-nowrap">
                        {keyword}
                      </span>
                    </div>
                  );
                }

                let dice = false;
                if (baseTag.charAt(baseTag.length - 1) === "d") {
                  dice = true;
                }

                return (
                  <div
                    key={crypto.randomUUID()}
                    title={tagDetail.name}
                    className={`first:mt-0.5 last:mb-0.5 my-0.25 inline-flex font-semibold items-center px-1 rounded ${tagDetail.textColor} ${tagDetail.bgColor} ring-2 dark:ring-1 ${tagDetail.ringColor} ring-inset truncate`}
                  >
                    {tagDetail.icon}
                    <span className="font-semibold whitespace-nowrap">
                      {dice
                        ? ` ${tagDetail.name}${count}`
                        : ` ${tagDetail.name} ${count}`}
                    </span>
                  </div>
                );
              })}
        </div>
      </td>
    );
  }
};

export default KeywordTags;
