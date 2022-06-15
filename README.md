<div id="top"></div>

<!-- PROJECT LOGO -->
<br />
<div align="center">

<h3 align="center">File Management System API</h3>

  <p align="center">
    An API for a file management system written in nestjs following the clean architecture
  </p>
</div>

<!-- ABOUT THE PROJECT -->
## About The Project

### Built With

* [NestJS](https://nestjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [MikroORM](https://mikro-orm.io/)

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* yarn
  ```sh
  npm install --global yarn
  ```

* nestjs/cli
  ```sh
  npm install -g @nestjs/cli
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/QuickSoOrt/file-management-system-backend.git
   ```
2. Install NPM packages
   ```sh
   yarn install
   ```
3. Create a folder named 'env' inside the project directory and inside create a file named 'local.env' with the following content
   ```
   #The database URL
   DATABASE_URL=
   
   #JWT Secret
   JWT_SECRET=
   
   #JWT expiration time (e.g 3600)
   JWT_EXPIRATION_TIME=3600
   
   #Location to where public files will be uploaded (e.g C:\Users\your-name\file-system\public\)
   UPLOAD_FILES_PUBLIC_LOCATION=
   
   #Location to where private files will be uploaded (e.g C:\Users\your-name\file-system\private\)
   UPLOAD_FILES_PRIVATE_LOCATION=
   
   #Key to encrypt files
   FILE_ENCRYPTION_KEY=
   ```

8. Run the project
   ```sh
   yarn start:dev
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
