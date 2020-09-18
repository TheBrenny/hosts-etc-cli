# hosts-etc-cli

> Take control of your hosts file through the command line!

## Installation

```console
$ npm install -g hosts-etc-cli
```

## Usage

Installed globally, so be anywhere in your system. This package uses [`sudo-prompt`](https://github.com/jorangreef/sudo-prompt) to request sudo privelages if required. The easy way around putting your password in (or hitting yes in the Windows UAC) is to `chmod` the hosts file to the level you're after.

Once you're ready for kick off, send this through to understand how to use this tool:

```console
$ hosts --help

   Edits your host file to make you the master!

   Usage:
    - hosts
            Will eventually open in interactive mode...

    - hosts -g [query]
    - hosts --get [query]
            Gets all hosts that match the query. A query can be in any of the
            following types to query for the different types:
             - "#region"   - Will search for regions that exactly match "region"
             - "127.0.x.1" - Will search for hosts that map to "127.0.\d{1,3}.1"
             - "name"      - Will search for hosts whose host contains "name"
             - ommitted    - Will return all hosts
            The result will be a list of all regions with their matching hosts.
            The output type of the result can be specified using '-o' or
            '--output'.

    - hosts -s <address> <host> [region] [comment]
    - hosts --set <address> <host> [region] [comment]
            Sets a host in your system's hostfile. [region] and [comment] are
            optional. To specify a comment and no region, set [region] to \"_\".
            This will run the NPM package 'hosts-etc' using the NPM package
            'sudo-prompt'. The output will be a number identifying how many
            hosts were successfully altered.

    - hosts -r <query>
    - hosts --remove <query>
            Removes hosts from your system's hostfile. <query> in this command
            is identical to [query] from the --get command, in that the
            following types are accepted:
             - "#region"   - Will remove the entire region.
             - "127.0.x.1" - Will remove hosts that map to "127.0.\d{1,3}.1"
             - "name"      - Will remove hosts whose host contains "name"
            The output will be a number identifying how many hosts were removed.

    - hosts -o <type>
    - hosts --output <type>
            Sets the output type of this command to the type specified. This is
            useful for chaining this command with others. The type needs to be
            one of the following (case-insensitive):
             - csv     - Will output the data as comma separated values
             - hosts   - WIll output the data as a host file
             - tabbed  - Will output the data as a tabbed list (DEFAULT)
             - json[x] - Will output the data as JSON. [x] is optional and
                         defines the amount of spaces to use when prettying the
                         result. 0 or ommitted means to uglify result (no spaces
                         and 1 line)

    - hosts --hostFile
            Prints out the location of your system's hostfile.

    - hosts -h
    - hosts --help
            Shows this help text.

```

### Interactive Mode

Usage: `hosts`

**Interactive mode is coming soon...** The idea of interactive mode is to enter a REPL where modifications can be made either using the full syntax of each command, or by prompting for answers to questions.

This hasn't been implemented yet nor planned out, but expect it to be there when we hit 1.2 at least.

### Get Host

Usage: `hosts {-g|--get} [query]`

Returns all hosts that match the query, or all hosts full stop if no query is given. Therefore, query is optional, but if it is provided, it must match the following types:

| Type | Description |
|:----:|:------------|
|`"#region"`| Will search for regions that exactly match `"region"`. |
|`"127.0.x.1`| Will regex search for addresses that match to `/127\.0\.\d{1,3}\.1/`. As in, all 'x's are replaced with `\d{1,3}`. |
|`"name"`| Will search for hosts whose host ***contains*** `"name"`. |
| ommitted | Will return all hosts.|

The output is controlled through the [`--output`](#output) command.

### Set Host

Usage `hosts {-s|--set} <address> <host> [region] [comment]`

Sets a host in your system's hostfile. `[region]` and `[comment]` are optional. To specify a comment and no region, set `[region]` to `"_"`. This will run the NPM package [`hosts-etc`](https://github.com/TheBrenny/hosts-etc) using the NPM package [`sudo-prompt`](https://github.com/jorangreef/sudo-prompt). The output will be a number identifying how many hosts were successfully altered - should only be 0 or 1.

### Remove Host

Usage: `hosts {-r|--remove} <query>`

Removes hosts that match the query, `<query>` in this command is identical to the `[query]` in the [`--get`](#get-hosts) command, except this time it is required. Therefore:

| Type | Description |
|:----:|:------------|
|`"#region"`| Will search for regions that exactly match `"region"`. |
|`"127.0.x.1"`| Will regex search for addresses that match to `/127\.0\.\d{1,3}\.1/`. As in, all 'x's are replaced with `\d{1,3}`. |
|`"name"`| Will search for hosts whose host ***matches*** `"name"`. |

### Output

Usage: `hosts {-o|--output} <type>`

Sets the output type of this command to the type specified. This is useful for chaining this command with others. The type needs to be one of the following (case-insensitive):

| Type | Description |
|:----:|:------------|
|`csv`| Will output the data as a CSV file, ready for spreadsheet tools like MS Excel. |
|`hosts`| Will output the data as a hosts file, ready to be put in place of your system's host file. This uses `hosts-etc`'s built-in `hostifyData(data)` method. |
|`json[x]`| Will output the data as a JSON string. The [x] is optional and defines how many spaces to use when prettying the JSON. Ommitting the value or using `0` will cause the output to be uglified (as specified by `JSON.stringify`). |
|`tabbed`| Will output the data as a tabbed list, where hosts in a region are indented once. |

### Host File

Usage: `hosts --hostFile`

Outputs the absolute path to your system's host file. Nothing much else to it...

## Contributing

Contributions are always welcome! Submit a PR, and we'll go from there!

## License

[MIT](https://choosealicense.com/licenses/mit/)