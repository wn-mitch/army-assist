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

                if (!match) {
                  window.alert(`Unknown keyword format: ${keyword}`);
                  return null;
                }

                const baseTag = match[1].trim();
                const count = match[2] ? match[2] : "";

                const tagDetail = getParameterCaseInsensitive(
                  tagDetails,
                  baseTag
                );

                if (!tagDetail) {
                  window.alert(`Unknown tag: ${baseTag}`);
                  return null;
                }

                let dice = false;
                if (baseTag.charAt(baseTag.length - 1) === "d") {
                  dice = true;
                }

                return (
                  <React.Fragment key={crypto.randomUUID()}>
                    <div
                      data-tooltip-target={`keyword-tooltip-${baseTag}`}
                      className={`first:mt-0.5 last:mb-0.5 my-0.25 inline-flex font-semibold items-center px-1 rounded ${tagDetail.textColor} ${tagDetail.bgColor} ring-2 dark:ring-1 ${tagDetail.ringColor} ring-inset truncate`}
                    >
                      {tagDetail.icon}
                      <span className="font-semibold whitespace-nowrap">
                        {dice
                          ? ` ${tagDetail.name}${count}`
                          : ` ${tagDetail.name} ${count}`}
                      </span>
                    </div>
                    <div
                      id={`keyword-tooltip-${baseTag}`}
                      role="tooltip"
                      className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs opacity-0 tooltip dark:bg-gray-700"
                    >
                      {tagDetail.name}
                      <div className="tooltip-arrow" data-popper-arrow></div>
                    </div>
                  </React.Fragment>
                );
              })}
        </div>
      </td>
    );
  }
};

export default KeywordTags;
