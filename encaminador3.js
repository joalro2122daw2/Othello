function encaminar(manegadorPeticions, pathname,response) {
    console.log('preparat per encaminar una petició a ...' + pathname);
    if (typeof manegadorPeticions[pathname] === 'function') {
      return manegadorPeticions[pathname](response);
    } else {
      console.log("No s'ha trobat manegador per a " + pathname);
      return "404 Not found";
    }
  }
  
  exports.encaminar = encaminar;