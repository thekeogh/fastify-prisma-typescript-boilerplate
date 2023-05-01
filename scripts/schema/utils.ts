/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";

import chalk from "chalk";
import glob from "glob-promise";
import { compileFromFile } from "json-schema-to-typescript";
import prettier from "prettier";

import { Parameter } from "./types.js";

export const utils = {
  filesystem: {

    /**
     * Perform a glob search for directories or filenames
     * 
     * @param path - The absolute directory path to read in glob pattern
     * @param filename - The filename (if applicable) to look for in glob pattern
     */
    async search(path: string, filename = ""): Promise<string[]> {
      const filepath = utils.string.removeLastCharacter(path, "/") + "/" + utils.string.removeFirstCharacter(filename, "/");
      return glob(filepath);
    },

    /**
     * Read a file and send the contents back. We do nothing with this data and send back the string
     * 
     * @param filepath - The path to the file to read
     * @returns 
     */
    async read(filepath: string): Promise<string> {
      return fs.readFile(filepath, { encoding: "utf-8" });
    },

    /**
     * Write to a file on disk
     * 
     * @param filepath - The path to the file to write
     * @param content - The content to write to the file
     * @returns 
     */
    async write(filepath: string, content: string): Promise<void> {
      return fs.writeFile(filepath, content);
    },

    /**
     * Return whether a file exists or not
     * 
     * @param filepath - Path to the file to check for
     */
    async exists(filepath: string): Promise<boolean> {
      try {
        await fs.access(filepath, fs.constants.F_OK);
        return true;
      } catch {
        return false;
      }
    },

    /**
     * Compile a JSON Schema file and return it's inferred TypeScript definition.
     * 
     * @param filepath - Path to the JSON Schema file
     */
    async compile(filepath: string): Promise<string> {
      const content = await compileFromFile(filepath, { additionalProperties: false, bannerComment: "" });
      return content.replaceAll("export ", "").trim();
    },

    /**
     * Get the resource from the directory path string. We know the pattern of this string, so we can be
     * explicit here.
     * 
     * @param dir - The directory path to parse
     */
    resource(dir: string): string {
      return dir.split("/resources/")[1].split("/")[0];
    },

    /**
     * Get the action from the directory path string.
     * 
     * @param dir - The directory path to parse
     */
    action(dir: string): string {
      return utils.array.last(dir.split("/"));
    },

    /**
     * Get the parameter from the filename string.
     * 
     * @param filename - The filename to parse
     */
    parameter(filename: string): Parameter {
      return filename.split(".")[0] as Parameter;
    },

    /**
     * Get the response status code from the filename string. We know this is only in response parameters, so we can be
     * explicit here. We ignore non-response parameters and will failsafe to 200 if a number isn't parsed.
     * 
     * @param filename - The filename to parse
     */
    code(filename: string): number | undefined {
      if (!filename.startsWith("response.")) {
        return;
      }
      const code = parseInt(filename.replace("response.", "").split(".")[0].trim());
      if (isNaN(code)) {
        return 200;
      }
      return code;
    },

  },

  string: {

    /**
     * Remove the first character from `source` if it matches `replace`
     * 
     * @param source - The source string to make the replace on
     * @param replace - The character we are looking to replace
     */
    removeFirstCharacter(source: string, replace: string): string {
      return source.charAt(0) === replace ? source.slice(1) : source;
    },

    /**
     * Remove the last character from `source` if it matches `replace`
     * 
     * @param source - The source string to make the replace on
     * @param replace - The character we are looking to replace
     */
    removeLastCharacter(source: string, replace: string): string {
      return source.charAt(source.length - 1) === replace ? source.slice(0, -1) : source;
    },

    /**
     * Removes all non-alphanumeric characters from the input string and capitalises the first letter (if required).
     * 
     * @param input - The input string to sanitise
     * @param capitlise - Shall we capitalise the first char (ideal for TS names)
     */
    sanitise(input: string, capitlise = true): string {
      const alphanumericOnly = input.replace(/[^0-9a-zA-Z]/g, "").toLowerCase().trim();
      return capitlise ? alphanumericOnly.charAt(0).toUpperCase() + alphanumericOnly.slice(1) : alphanumericOnly;
    },

  },

  array: {

    /**
     * Return the last value (string) from an array.
     * 
     * @param arr - The array to get the value from
     */
    last(arr: string[]): string {
      return arr.slice(-1)[0];
    },

    /**
     * Remove an item by value from an array
     * 
     * @param arr - The array to remove from
     * @param value - The value to remove from the array
     */
    remove(arr: string[], value: string): string[] {
      return arr.filter(item => item !== value);
    },

  },

  object: {

    /**
     * Traverse an object (of any level) to extract the content from the target key(s).
     * 
     * @param obj - Object to traverse
     * @param target - The target key we are looking for 
     */
    find(obj: Record<string, any>, target: string): string[] {
      const results: string[] = [];
      for (const key in obj) {
        if (key === target) {
          results.push(obj[key] as string);
        } else if (typeof obj[key] === "object") {
          const nestedResults = utils.object.find(obj[key], target);
          results.push(...nestedResults);
        }
      }
      return results;
    },

  },

  templates: {

    /**
     * Fetch the contents of a template file
     * 
     * @param template - The template filename. Do not include the file extension.
     * 
     * @example utils.templates.read("typescript") => /schema/templates/typescript.template
     */
    async read(template: string): Promise<string> {
      const path = process.cwd() + "/scripts/schema/templates/" + template + ".template";
      return utils.filesystem.read(path);
    },

    /**
     * Prettify a code snippet using Prettier.
     * 
     * @param input - The input code to be prettified
     * @param parser - What parser we should use (what lang is this)
     */
    prettier(input: string, parser: "typescript" | "json"): string {
      return prettier.format(input, { parser });
    },

  },

  notification: {

    /**
     * Send a warning notification to the terminal
     * 
     * @param message - The message for the notification
     */
    warn(message: string): void {
      return console.log(`${chalk.bgYellow.hex("#000000").bold(" ⚠ ")} ${chalk.dim.white.bold(message)}`);
    },

    /**
     * Send a success notification to the terminal
     * 
     * @param message - The message for the notification
     */
    success(message: string): void {
      return console.log(`${chalk.bgGreen.hex("#000000").bold(" ✓ ")} ${chalk.green.bold(message)}`);
    },

    /**
     * Send a error notification to the terminal
     * 
     * @param message - The message for the notification
     */
    error(message: string): void {
      return console.log(`${chalk.bgRed.hex("#000000").bold(" ✘ ")} ${chalk.red.bold(message)}`);
    },

    /**
     * Send a info notification to the terminal
     * 
     * @param message - The message for the notification
     */
    info(message: string): void {
      return console.log(`${chalk.bgBlue.hex("#000000").bold(" i ")} ${chalk.blue.bold(message)}`);
    },

  },
};