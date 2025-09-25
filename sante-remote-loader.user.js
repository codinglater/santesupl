// ==UserScript==
// @name         Sante PDF Batch Extractor (Remote)
// @namespace    https://github.com/codinglater/santesupl
// @version      1.0.0
// @description  Batch extract data from PDFs on rezultateptmedici.clinica-sante.ro - loads remotely from GitHub
// @author       Vlad
// @match        *://rezultateptmedici.clinica-sante.ro/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Configure PDF.js worker
    if (typeof window.pdfjsLib !== 'undefined') {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    }

    // Remote GitHub repository configuration
    const GITHUB_USER = 'codinglater';  // Replace with your GitHub username
    const GITHUB_REPO = 'santesupl';  // Replace with your repository name
    const GITHUB_BRANCH = 'main';  // Replace with your branch name if different

    // Function to load remote scripts
    async function loadRemoteScript(filename) {
        const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filename}`;

        try {
            console.log(`Loading remote script: ${url}`);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const scriptContent = await response.text();

            // Create and execute script
            const script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);

            console.log(`✅ Successfully loaded: ${filename}`);
            return true;
        } catch (error) {
            console.error(`❌ Failed to load ${filename}:`, error);
            return false;
        }
    }

    // Load required scripts in order
    async function initializeRemoteScripts() {
        console.log('🚀 Starting remote script loading...');

        try {
            // Load the PDF processor first (if you have it as a separate file)
            // await loadRemoteScript('pdf-processor.js');

            // Load the main content script
            const mainScriptLoaded = await loadRemoteScript('content.js');

            if (mainScriptLoaded) {
                console.log('✅ All remote scripts loaded successfully');
            } else {
                console.error('❌ Failed to load main content script');
                alert('Failed to load Sante PDF Extractor. Please check your internet connection and try refreshing the page.');
            }

        } catch (error) {
            console.error('❌ Error during remote script initialization:', error);
            alert('Error loading Sante PDF Extractor: ' + error.message);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeRemoteScripts);
    } else {
        initializeRemoteScripts();
    }

})();
