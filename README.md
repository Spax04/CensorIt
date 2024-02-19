# CensorIt

CensorIt is the best web extension for censoring explicit and inappropriate content.
CensorIt can block and censor every site, and can be custom for every parent for their own preferences.
It can censor specific words and block websites completely

## Installation

1. **clone this repository**
```
git clone https://github.com/Spax04/CensorIt.git
```

<br>

2. **upload the extension to your google chrome** <br><br>
&nbsp;&nbsp;&nbsp;2.1 **press the extension button** <br>
&nbsp;&nbsp;&nbsp;2.2 **press the 'Manage extensions' button** <br>
&nbsp;&nbsp;&nbsp;2.3 **press the 'Load unpacked' button** <br>
&nbsp;&nbsp;&nbsp;2.4 **upload the client folder** <br>
<br>

3. **change diractory to API**
```
cd ./CensorIt/API
```

<br>

4. **install packages**
```
npm install
```

<br>

5.**build the project**
```
npm run build
```

<br>

6. **run the API**
```
npm start
```

<br>

## Routes
authentication routes:
```
Sign In: POST /signIn
Sign Up: POST /signUp
Password Check: POST /passCheck
```
scanning routes:
```
Scan Link: POST /link
Scan Text: POST /text
```
user management routes:
```
Edit White Category: PUT /:id/white-category
Edit White Website: PUT /:id/white-website
Edit White Word: PUT /:id/white-word
Edit Personal Block Percentage: PUT /:id/personal-block-percentage
Get User Lists: GET /:id/white-lists
```

