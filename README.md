# eresidencehk

Review the e-residence.hk priority number.

Online Calculator: https://eresidence-hk.glitch.me/

## Crawl the Application Result

#### Result

`data/applications.csv`

#### Do It Yourself

```js
node search.js
```

## Statistics

#### Result

```
# Applications
Category 1 (family): 7600
Category 2 (one-person): 13278
Total: 20878

# Ratio
For every 1 family application, there are 1.7471052631578947 one-person applications.
```

#### Do It Yourself

```js
node stats.js
```

## Calculate Your Batch

#### Example

```
Note: Each batch consists of 10 applications [6 cat1 (family) + 4 cat2 (one-person)].

Application no.: U300806
Priority: 9
Category: 2

Position in the category: 5
Batch: 2
```

#### Do It Yourself

```js
node calculate-batch.js
```
