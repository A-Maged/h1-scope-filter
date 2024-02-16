const BANNER = `
Usage: node main.js [--no-bounty] [--no-submission] [--asset-types <ASSET_TYPES>] <handle>

--no-bounty                  Exclude assets that are not eligible for bounty

--no-submission              Exclude assets that are not eligible for submission

--asset-types <ASSET_TYPES>  Comma separated list of asset types. 

<handle>                     HackerOne handle or URL

Examples:
  node main.js  visa
  node main.js  --asset-types domain,wildcard bookingcom
  node main.js --no-bounty visa
  node main.js --no-submission visa
  node main.js --no-bounty --no-submission visa
`

const ASSET_TYPES_LIST = [
  "CIDR",
  "URL",
  "APPLE_STORE_APP_ID",
  "TESTFLIGHT",
  "OTHER_IPA",
  "GOOGLE_PLAY_APP_ID",
  "OTHER_APK",
  "WINDOWS_APP_STORE_APP_ID",
  "SOURCE_CODE",
  "DOWNLOADABLE_EXECUTABLES",
  "HARDWARE",
  "OTHER",
  "SMART_CONTRACT",
  "WILDCARD",
  "IP_ADDRESS",
  "AI_MODEL",
]

const args = process.argv.slice(2)

const assetTypes = args.includes("--asset-types")
  ? args[args.indexOf("--asset-types") + 1]
      ?.toUpperCase()
      .replace("DOMAIN", "URL") /* domain is used in the UI, but URL is used in the API */
      ?.split(",")
      .filter((t) => ASSET_TYPES_LIST.includes(t))
  : []

const eligibleForBounty = !args.includes("--no-bounty")
const eligibleForSubmission = !args.includes("--no-submission")
let targetHandle = args[args.length - 1]

/* if no handle is supplied */
if (!targetHandle || targetHandle.includes("--")) {
  console.log(BANNER)
  console.log("Possible asset types:")
  console.log("\x1b[32m", ASSET_TYPES_LIST.join(", ")) // Green
  process.exit(1)
} else if (targetHandle.includes("https://hackerone.com/")) {
  /* if handle is a url, extract the handle */
  targetHandle = targetHandle.split("/")[3]
}

const gqlQuery = JSON.stringify({
  operationName: "PolicySearchStructuredScopesQuery",
  variables: {
    handle: targetHandle,
    searchString: "",
    eligibleForSubmission,
    eligibleForBounty,
    asmTagIds: [],
    assetTypes,
    from: 0,
    size: 100,
    sort: {
      field: "cvss_score",
      direction: "DESC",
    },
    product_area: "h1_assets",
    product_feature: "policy_scopes",
  },
  query: `
    query PolicySearchStructuredScopesQuery(
        $handle: String!
        $searchString: String
        $eligibleForSubmission: Boolean
        $eligibleForBounty: Boolean
        $minSeverityScore: SeverityRatingEnum
        $asmTagIds: [Int]
        $assetTypes: [StructuredScopeAssetTypeEnum!]
        $from: Int
        $size: Int
        $sort: SortInput
      ) {
        team(handle: $handle) {
          structured_scopes_search(
            search_string: $searchString
            eligible_for_submission: $eligibleForSubmission
            eligible_for_bounty: $eligibleForBounty
            min_severity_score: $minSeverityScore
            asm_tag_ids: $asmTagIds
            asset_types: $assetTypes
            from: $from
            size: $size
            sort: $sort
          ) {
            nodes {
              ... on StructuredScopeDocument {
                identifier
              }
            }
            pageInfo {
              startCursor
              hasPreviousPage
              endCursor
              hasNextPage
            }
            total_count
          }
        }
      }
    `,
})

fetch("https://hackerone.com/graphql", {
  headers: {
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
  },
  body: gqlQuery,
  method: "POST",
})
  .then((res) => res.json())
  .then((res) => {
    res.data?.team?.structured_scopes_search?.nodes?.map((n) => console.log(n?.identifier))
  })
  .catch((err) => {
    console.error(err)
  })