# rev-proxy

This is a simple reverse proxy for use in Development.

**Usage:** `npx rev-proxy -p [port] -r [remote url] [...]`

You can repeat each set of `-p` and `-r` multiple times to set up multiple proxy mappings.

You can also run `npm i -g rev-proxy` to install it globally on your computer, then run the above command (excluding the `npx`) to run your local version.

Once the rev-proxy is launched with a proxy mapping, launch your application, replacing the original URL with `http://localhost:<port>`. rev-proxy will forward your request to the upstream server and print the request and response details to the console.

It's recommended you use rev-proxy in coordination with the 'tee' command to write the output to a file on disk for more powerful processing.

* Bash/Zsh/etc.: `npx rev-proxy [...] | tee <filename>`
* Powershell: `npx rev-proxy [...] | Tee-Object <filename>`

Now you will see the output of rev-proxy printed to your console as well as appended to the specified file.

## Example

1. Open a terminal and run `npx rev-proxy -p 8080 -r https://reqbin.com`
2. Open your web browser and navigate to `http://localhost:8080/echo/get/json`

-----

Your web browser should show:
```
{"success":"true"}
```

While your terminal should look similar to:

```
> npx rev-proxy -p 8080 -r https://reqbin.com
Proxying HTTP on port 8080 to https://reqbin.com (0-)
0-e3dfd355 > GET /echo/get/json
0-e3dfd355 > Host: localhost:8080
0-e3dfd355 > User-Agent: curl/7.79.1
0-e3dfd355 > Accept: */*

0-e3dfd355 < 200 OK
0-e3dfd355 < Date: Sun, 10 Apr 2022 03:01:42 GMT
0-e3dfd355 < Content-Type: application/json
0-e3dfd355 < Content-Length: 19
0-e3dfd355 < Connection: close
0-e3dfd355 < Access-Control-Allow-Origin: *
0-e3dfd355 < Last-Modified: Sun, 10 Apr 2022 01:28:19 GMT
0-e3dfd355 < Cache-Control: max-age=31536000
0-e3dfd355 < Cf-Cache-Status: HIT
0-e3dfd355 < Accept-Ranges: bytes
0-e3dfd355 < Expect-Ct: max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"
0-e3dfd355 < Report-To: {"endpoints":[{"url":"https:\/\/a.nel.cloudflare.com\/report\/v3?s=y4U%2FnIkI%2BTTSQO72y6ifQbIaX6RavG4xJJybBtJhdL1D5msCJNzlgQiCF7I6pJYt5Ivcs9hZcX2Sfju%2F4e9YhirP2nnSFRZAZvyrnPuvLtpn1d2RVO1YO%2FBfwLzZ"}],"group":"cf-nel","max_age":604800}
0-e3dfd355 < Nel: {"success_fraction":0,"report_to":"cf-nel","max_age":604800}
0-e3dfd355 < Server: cloudflare
0-e3dfd355 < Cf-Ray: 6f983d4cec7bee9e-AKL
0-e3dfd355 < Alt-Svc: h3=":443"; ma=86400, h3-29=":443"; ma=86400
0-e3dfd355 | {"success":"true"}
0-e3dfd355 | 
```

## FAQ

### What do the random characters at the start of each line mean?
> This is the request ID and is unique for each request. `rev-proxy` can process multiple simultaneous requests, either to the same or different hosts, so to allow you to later view the requests more easily you can filter the output for the request ID.
> 
> The request ID is prefixed with a mapping key. 
> For the output: `Proxying HTTP on port 8080 to https://reqbin.com (0-)`, "`0-`" will be the prefix to all request IDs for this mapping, so you can filter for lines starting with that to find all the requests to a specific host.

### What do all the symbols (`>`, `<`, `|`) mean?
> * `>` Are the request method, URL and headers
> * `<` Are the response headers
> * `|` Is the body of either the request or response.  
>   The body _always_ appears after the headers, so if you see `<` followed by `|`, this is the response body.
