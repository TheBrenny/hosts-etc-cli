#!/usr/bin/env node

const bossman = require('big-kahuna').dashCare(true);
const hosts = require('hosts-etc');
const sudo = require('sudo-prompt');

async function cli() {
    if (bossman.has("-h", "--help")) {
        help();
        return 0;
    }

    if (bossman.weight == 0) {
        console.log("Interactive mode is coming...");
        return 0;
    }

    if (bossman.has("-s", "--set")) {
        let a = 0;
        try {
            let host = bossman.must.answerAmount([2, 4], "-s", "--set");
            host = {
                address: host[0],
                host: host[1],
                region: host[2] || "",
                comment: host[3] || ""
            };
            a = set(host);
            console.log(`${a} host${(a === 1 ? "" : "s")} set.`);
        } catch (e) {
            let winning = false;
            let out = "";
            if (e.code === "EPERM" && !process.env.SUDO_TRIED) {
                out = await (sudoHosts().then((d) => {
                    winning = true;
                    return d;
                }).catch((err) => console.error(err)));
            }
            if (!winning) {
                console.error(e);
                return e.code;
            } else console.log(out);
        }
        return 0;
    }

    if (bossman.has("-r", "--remove")) {
        try {
            let a = remove(bossman.must.answer("-r", "--remove"));
            console.log(`${a} host${(a === 1 ? "" : "s")} removed.`);
        } catch (e) {
            let winning = false;
            let out = "";
            if (e.code === "EPERM" && !process.env.SUDO_TRIED) {
                out = await (sudoHosts().then((d) => {
                    winning = true;
                    return d;
                }).catch((err) => console.error(err)));
            }
            if (!winning) {
                console.error(e);
                return e.code;
            } else console.log(out);
        }
        return 0;
    }

    if (bossman.has("-g", "--get")) {
        let out = get(bossman.answer("-g", "--get") || "");
        let type = bossman.answer("-o", "--output");

        console.log(output(out, type));
        return 0;
    }

    if (bossman.has("--hostFile")) {
        console.log(hosts.HOSTS);
        return 0;
    }

    console.error("Invalid command. Enter hosts -h for help.");
    return 1;
}

cli().then(code => process.exit(code));

function help() {
    let msg = [
        "",
        "   Edits your host file to make you the master!",
        "",
        "   Usage:",
        "    - hosts",
        "            Will eventually open in interactive mode...",
        "",
        "    - hosts -g [query]",
        "    - hosts --get [query]",
        "            Gets all hosts that match the query. A query can be in any of the",
        "            following types to query for the different types:",
        '             - "#region"   - Will search for regions that exactly match "region"',
        '             - "127.0.x.1" - Will search for hosts that map to "127.0.\d{1,3}.1"',
        '             - "name"      - Will search for hosts whose host contains "name"',
        '             - ommitted    - Will return all hosts',
        "            The result will be a list of all regions with their matching hosts.",
        "            The output type of the result can be specified using '-o' or",
        "            '--output'.",
        // "", // I don't think we actually need an add bc we can "set" hosts?
        // "    - hosts -a <address> <host> [region] [comment]",
        // "    - hosts --add <address> <host> [region] [comment]",
        // "            Adds a host to your system's hostfile. [region] and [comment] are",
        // "            optional. To specify a comment and no region, set [region] to \"_\".",
        // "            This will run the NPM package 'hosts-etc' using the NPM package",
        // "            'sudo-prompt'. The output will be a number identifying how many new",
        // "            were successfully added.",
        "",
        "    - hosts -s <address> <host> [region] [comment]",
        "    - hosts --set <address> <host> [region] [comment]",
        "            Sets a host in your system's hostfile. [region] and [comment] are",
        "            optional. To specify a comment and no region, set [region] to \"_\".",
        "            This will run the NPM package 'hosts-etc' using the NPM package",
        "            'sudo-prompt'. The output will be a number identifying how many",
        "            hosts were successfully altered.",
        "",
        "    - hosts -r <query>",
        "    - hosts --remove <query>",
        "            Removes a host from your system's hostfile. <query> in this command",
        "            is identical to [query] from the --get command, in that the",
        "            following types are accepted:",
        '             - "#region"   - Will remove the entire region.',
        '             - "127.0.x.1" - Will remove hosts that map to "127.0.\d{1,3}.1"',
        '             - "name"      - Will remove hosts whose host contains "name"',
        "            The output will be a number identifying how many hosts were removed.",
        "",
        "    - hosts -o <type>",
        "    - hosts --output <type>",
        "            Sets the output type of this command to the type specified. This is",
        "            useful for chaining this command with others. The type needs to be",
        "            one of the following (case-insensitive):",
        "             - csv     - Will output the data as comma separated values",
        "             - hosts   - WIll output the data as a host file",
        "             - json    - Will output the data as JSON",
        "             - tabbed  - Will output the data as a tabbed list (DEFAULT)",
        "",
        "    - hosts --hostFile",
        "            Prints out the location of your system's hostfile.",
        "",
        "    - hosts -h",
        "    - hosts --help",
        "            Shows this help text.",
        "",
    ];
    console.log(msg.join("\n"));
}

function get(query) {
    return hosts.get(query);
}

function set(hostData) {
    return hosts.set(hostData);
}

function remove(query) {
    return hosts.remove(query);
}

function output(output, type) {
    let out = "";
    let outTypes = ["tabbed", "csv", "hosts", "json"];
    if (typeof type === "undefined") type = outTypes[0];
    if (!outTypes.includes(type) && !type.startsWith("json")) {
        out += "!! Unkown output type: " + type + "\n\n";
        type = outTypes[0];
    }
    type = type.toLowerCase();

    if (type === "csv") {
        out = "region,address,host,comment\n";
        for (let r in output) {
            if (output[r].length === 0) continue;
            for (let h of output[r]) out += csvHost(h) + "\n";
        }
    } else if (type === "hosts") {
        out = "# Host file generated by TheBrenny/hosts-etc\n\n";
        for (let r in output) {
            if (output[r].length === 0) continue;
            out += output[r][0].makeRegionLine() + "\n";
            for (let h of output[r]) out += h.makeHostLine() + "\n";
            out += (output[r][0].region != "" ? "# end region" : "") + "\n";
        }
    } else if (type.startsWith("json")) {
        let pretty = 0;
        if (type !== "json") pretty = parseInt(type.slice("json".length));
        out = JSON.stringify(output, null, pretty);
    } else { // tabbed
        for (let r in output) {
            let tab = "    ";
            if (output[r].length === 0) continue;
            if (r === "") tab = "";
            else out += output[r][0].region + ":\n";
            for (let h of output[r]) out += tab + tabbedHost(h) + "\n";
            out += "\n";
        }
    }
    return out;
}

function csvHost(host) {
    return host.region + "," + host.address + "," + host.host + "," + host.comment;
}

function tabbedHost(host) {
    let t = " ".repeat(15 - host.address.length); // 15 is max ip length
    return host.address + t + " <- " + host.host + (host.comment.length ? "  (" + host.comment + ")" : "");
}

async function sudoHosts() {
    return new Promise((resolve, reject) => {
        sudo.exec(process.argv.map(e => `"${e}"`).join(" "), {
            name: "hosts etc",
            env: {
                SUDO_TRIED: "true"
            }
        }, (e, out, err) => {
            if (e) reject(e || err);
            else resolve(out);
        });
    });
}