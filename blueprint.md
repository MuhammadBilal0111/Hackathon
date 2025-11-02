# Project Blueprint

## Overview

This document outlines the plan for adding dual-language support (English and Urdu) to the Next.js application. The goal is to create a seamless, multilingual user experience with proper RTL support for Urdu.

## Current State

The application is currently a single-language (English) Next.js app. All text is hardcoded into the components.

## Plan

### 1. **Setup i18n**
   - Install `i18next`, `react-i18next`, and `i18next-browser-languagedetector`.
   - Create a `lib/i18n.ts` file to configure i18next.
   - Create `locales/en/common.json` and `locales/ur/common.json` for storing translations.

### 2. **Language Context**
   - Create a `context/LanguageContext.tsx` to manage the application's language state globally.
   - The context will provide the current language and a function to change it.

### 3. **Integrate into the App**
   - Wrap the root layout in `app/layout.tsx` with the `LanguageProvider`.
   - Add a language switcher to the header (`components/shared/header.tsx`) to allow users to toggle between English and Urdu.
   - Dynamically add the `dir` attribute to the `<html>` tag based on the selected language to handle LTR/RTL layouts.

### 4. **Migrate Content**
   - Systematically replace all hardcoded English text in `.tsx` files with the `t()` function from `react-i18next`.
   - Populate `locales/en/common.json` with the extracted English strings.
   - Populate `locales/ur/common.json` with the corresponding Urdu translations.

## Implemented Features

### Style and Design
- Modern, interactive iconography and UI components.
- Expressive and relevant typography.
- Vibrant color palette with a wide range of hues.
- Subtle noise texture on the main background for a premium feel.
- Multi-layered drop shadows for a sense of depth.
- Intuitive navigation and user experience.
- Mobile-responsive design.

### Application Features
- Dual-language support (English and Urdu).
- Global language state management.
- i18n for internationalization.
- RTL support for the Urdu language.
- Language switcher in the header.
