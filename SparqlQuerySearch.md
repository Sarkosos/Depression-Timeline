```bash
SELECT DISTINCT ?drug ?drugLabel ?ID ?msLabel 
WITH
{
SELECT DISTINCT ?drug ?ID 
WHERE {
  VALUES ?idProp { wdt:P662 }
  VALUES ?drug { wd:Q18216 }
  ?drug wdt:P31* wd:Q12140 .
  ?drug ?idProp ?ID .
OPTIONAL{ ?drug wdt:P2240 ?ld}
OPTIONAL{ ?drug p:P2300 ?minLdStatHumans .
          ?minLdStatHumans ps:P2300 ?minLdhumans .
          ?minLdStatHumans pq:P703 wd:Q5.
          ?drug p:P2300 ?minLdStatMice .
          ?minLdStatMice ps:P2300 ?minLdmice .
          ?minLdStatMice pq:P703 wd:Q2842787.
}
OPTIONAL{?drug wdt:P117 ?chemStruct} 
OPTIONAL{?drug wdt:P2175 ?pph}
OPTIONAL{?drug wdt:P769 ?sdi}
OPTIONAL{?drug wdt:P3489 ?pc}
# OPTIONAL{?drug wdt:P129 ?piw}
} LIMIT 1000
} AS %RESULTS WITH {
  SELECT DISTINCT ?drug ?ID ?ms
  WHERE {
    INCLUDE %RESULTS
    ?ms wdt:P921 ?drug
  }
} AS %ARTICLES {
  INCLUDE %ARTICLES
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
```
