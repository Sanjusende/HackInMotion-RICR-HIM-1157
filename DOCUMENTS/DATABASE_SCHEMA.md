# Database Schema

## User Collection

| Field | Type |
|---------|---------|
| name | String |
| email | String |
| phone | String |
| password | String |
| role | String |
| language | String |
| avatar | String |
| createdAt | Date |

---

## Farm Collection

| Field | Type |
|---------|---------|
| userId | ObjectId |
| farmName | String |
| state | String |
| district | String |
| village | String |
| latitude | Number |
| longitude | Number |
| landSize | Number |
| soilType | String |
| currentCrop | String |
| plannedCrop | String |
| irrigationMethod | String |

---

## Weather Collection

| Field | Type |
|---------|---------|
| farmId | ObjectId |
| temperature | Number |
| humidity | Number |
| rainfall | Number |
| forecastDate | Date |

---

## Disease Detection Collection

| Field | Type |
|---------|---------|
| farmId | ObjectId |
| imageUrl | String |
| diseaseName | String |
| confidence | Number |
| recommendation | String |

---

## Market Collection

| Field | Type |
|---------|---------|
| cropName | String |
| marketName | String |
| price | Number |
| date | Date |