# Custom @types

In case one or more of the JavaScript libraries you imported don't have a declaration file,
you can create your own declaration as follow:
1. Create a directory named as the library (e.g. `third-party-library-name`)
2. Create the file `index.d.ts` within the new folder
3. Add the declarations within the module `third-party-library-name`
   
   e.g.
   ```typescript
   declare module 'third-party-library-name' {
   
       // your declarations go here
   
   }
   ```
