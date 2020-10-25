// I'm designing this HTML page to run as a standalone HTML file without an HTTP server
// For example, unpack from the zip archive and double click on it to get it run
//
// But...Firefox will report "CORS request not HTTP" error
// when try to use fetch api to get translate file from file:/// URLs
// See:
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp
//
// So these strange codes will use a hack to get things done
// By add script block with the dynamically generated URL src attribute.
var languagePatch = {
    // ID of HTML tag with translate
    idCollection: {
        applicationName: 'application-name',
        applicationIntroduction: 'application-introduction',
        applicationAuthor: 'application-author',
        uploaderSelectSkinFile: 'uploader-select-skin-file-title',
        uploaderChooseSkinPlaceholder: 'uploader-choose-skin-placeholder',
        uploaderSkinType: 'uploader-skin-type',
        uploaderSkinTypeSteve: 'uploader-skin-type-steve',
        uploaderSkinTypeAlex: 'uploader-skin-type-alex',
        uploaderFileName: 'fileName',
        uploaderSubmit: 'uploader-submit',
        apiInformationPowered: 'api-information-powered',
        informationImVeryHappy: 'information-i-m-very-happy',
        informationHopeHelpUs: 'information-hope-help-us',
        informationLol: 'information-lol',
        informationDonate: 'information-donate',
        footerPowered: 'footer-powered'
    },
    // Language file URL, example: 'Resources/language/en-US.js'
    languageUrl: 'Resources/language/' + navigator.language + '.js',
    // Add a script block to HTML document with dynamically generated script-src
    // If the user is using unsupported language (file not exist)
    // The language patch will simply fail and fallback to the original language written in HTML
    // I think this will not affect the other javascript code functionality
    appendScriptBlock: function () {
        let languageBlock = document.createElement('script');
        languageBlock.src = this.languageUrl;
        document.getElementsByTagName('body')[0].appendChild(languageBlock);
    },
    // The new script block will run a call back bring the "language config file" back
    apply: function (languageConfig) {
        let applicationName = this.idCollection.applicationName;
        document.getElementById(applicationName).childNodes[0].textContent = languageConfig.applicationName + ' ';

        let applicationIntroduction = this.idCollection.applicationIntroduction;
        document.getElementById(applicationIntroduction).childNodes[0].textContent = languageConfig.applicationIntroduction + ' ';

        let applicationAuthor = this.idCollection.applicationAuthor;
        document.getElementById(applicationAuthor).childNodes[0].textContent = languageConfig.applicationAuthor + ' ';

        let uploaderSelectSkinFile = this.idCollection.uploaderSelectSkinFile;
        document.getElementById(uploaderSelectSkinFile).childNodes[1].textContent = ' ' + languageConfig.uploaderSelectSkinFile;

        let uploaderChooseSkinPlaceholder = this.idCollection.uploaderChooseSkinPlaceholder;
        document.getElementById(uploaderChooseSkinPlaceholder).childNodes[0].textContent = languageConfig.uploaderChooseSkinPlaceholder;

        let uploaderSkinType = this.idCollection.uploaderSkinType;
        document.getElementById(uploaderSkinType).childNodes[0].textContent = languageConfig.uploaderSkinType;

        let uploaderSkinTypeSteve = this.idCollection.uploaderSkinTypeSteve;
        document.getElementById(uploaderSkinTypeSteve).childNodes[0].textContent = languageConfig.uploaderSkinTypeSteve;

        let uploaderSkinTypeAlex = this.idCollection.uploaderSkinTypeAlex;
        document.getElementById(uploaderSkinTypeAlex).childNodes[0].textContent = languageConfig.uploaderSkinTypeAlex;

        let uploaderFileName = this.idCollection.uploaderFileName;
        document.getElementById(uploaderFileName).setAttribute('placeholder', languageConfig.uploaderFileName);

        let uploaderSubmit = this.idCollection.uploaderSubmit;
        document.getElementById(uploaderSubmit).childNodes[0].textContent = languageConfig.uploaderSubmit;

        let apiInformationPowered = this.idCollection.apiInformationPowered;
        document.getElementById(apiInformationPowered).nextSibling.textContent = languageConfig.apiInformationPowered + ' ';

        let informationImVeryHappy = this.idCollection.informationImVeryHappy;
        document.getElementById(informationImVeryHappy).childNodes[0].textContent = '😊 ' + languageConfig.informationImVeryHappy + ' ';

        let informationHopeHelpUs = this.idCollection.informationHopeHelpUs;
        document.getElementById(informationHopeHelpUs).childNodes[0].textContent = '— ' + languageConfig.informationHopeHelpUs + ' ';

        let informationLol = this.idCollection.informationLol;
        document.getElementById(informationLol).childNodes[0].textContent = languageConfig.informationLol;

        let informationDonate = this.idCollection.informationDonate;
        document.getElementById(informationDonate).childNodes[1].textContent = languageConfig.informationDonate;

        let footerPowered = this.idCollection.footerPowered;
        document.getElementById(footerPowered).nextSibling.textContent = ' ' + languageConfig.footerPowered + ' ';
    }
};

// Trigger the code to run
languagePatch.appendScriptBlock();