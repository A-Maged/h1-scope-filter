#### Usage:

```bash
npx h1-scope-filter [--no-bounty] [--out-of-scope] [--asset-types <ASSET_TYPES>] <program_handle>
```

`--no-bounty`: Show assets that are not eligible for bounty

`--out-of-scope`: Show assets that are not eligible for submission(out of scope)

`--asset-types`: <ASSET_TYPES> Comma separated list of asset types.

`<program_handle>`: HackerOne program handle or URL

#### Examples:

```bash
  # get assets in scope and eligible bounty
  npx h1-scope-filter visa

  # filter by asset types
  npx h1-scope-filter --asset-types domain,wildcard bookingcom

  # get assets that are not eligible for bounty
  npx h1-scope-filter --no-bounty mars

  # get assets that are not eligible for submission(out of scope)
  npx h1-scope-filter --out-of-scope security
```

#### Possible asset types:

- `CIDR`
- `URL`
- `APPLE_STORE_APP_ID`
- `TESTFLIGHT`
- `OTHER_IPA`
- `GOOGLE_PLAY_APP_ID`
- `OTHER_APK`
- `WINDOWS_APP_STORE_APP_ID`
- `SOURCE_CODE`
- `DOWNLOADABLE_EXECUTABLES`
- `HARDWARE`
- `OTHER`
- `SMART_CONTRACT`
- `WILDCARD`
- `IP_ADDRESS`
- `AI_MODEL`
