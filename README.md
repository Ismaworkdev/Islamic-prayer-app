# Islamic-prayer-app
github : https://github.com/Ismaworkdev/Islamic-prayer-app


En el index se mostrará la fecha gregoriana, obtenida utilizando el objeto Date. La fecha islámica se obtendrá a través de una API . 

Para la ubicación, se utilizará una API privada a la que se le pasarán las coordenadas de latitud y longitud obtenidas mediante la API nativa de JavaScript Navigator.

Dependiendo de la hora actual, se indicará cuál es el siguiente rezo. Los horarios de los rezos de hoy, que siempre son seis, se mostrarán con la hora exacta basada en la lat y lon , ya que estos horarios varían según la ubicación y la estación del año.

En cuanto a la brújula, al proporcionar la lat y lon, se realizará un cálculo para determinar la dirección hacia la Meca. Este cálculo está comentado en la función.

El mes islámico se imprimirá utilizando la información de la API adhan , indicando también el día. El día del calendario islámico y el día del calendario gregoriano no tienen nada que ver, son diferentes . 
