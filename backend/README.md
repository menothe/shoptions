# What is it

This is a bare bones Gin project for listing auctions. Currently there are two supported endpoints for creating and obtaining item listings. The items are stored in memory at the moment.

## How to use

Run `go run main.go` to boot up the server then use curl or postman to submit requests:

JSON:

```json
{
    "category": "books",
    "sellerId": "bbb23fb6-6cdb-4119-ae1d-e98eac159a30",
    "title": "Women by Charles Bukowski",
    "productImage": "randomUrl.com/random_png"
}
```