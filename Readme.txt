Prezentarea generala a proiectului o puteti gasi in folderul Needs unde este atasat un document word explicativ.
Pachete instalate:
 "dependencies": {
    "@chakra-ui/react": "^3.8.1",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.0",
    "axios": "^1.8.1",
    "bcryptjs": "^3.0.2",
    "body-parser": "^1.20.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "framer-motion": "^12.4.7",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.10.2",
    "mongoose-timestamp": "^0.6.0",
    "react-router-dom": "^7.2.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }

Rulare backend: npm run dev (se ruleaza din directorul backend)
Rulare frontend: npm run dev (se ruleaza din directorul frontend)

Scenariu user nelogat: poate naviga prin toate paginile ca si un user de tip fun doar ca nu poate plasa comenzi deoarece necesita autentificare;

Scenariu user "fan":
-poti cumpara maxim 10 produse per produs ( ex maxim 10 Ballon d or, dar poti cumpara 10 Trofee Champions League si 10 Trofee Ballon d or);
-poti cumpara maxim 5 bilete la un meci indiferent de categorie ( 1 Standart ,2 VIP,2 General spre ex);
-pentru comanda cu cardul daca introducem la nr cardului numai 0-uri nu te va lasa sa plasezi comanda;
-sisteme de filtrare responsivness la majoritatea paginilor;
-ecran adaptiv pentru modele de telefoane si tablete;
-user alex1308 parola alex1308 (majoritatea conturilor sunt username+1308 la final)

Scenariu user "player";
-mai mult este un mod de view pentru informatiile furnizate de catre manager;
-user coman parola coman1308;

Scenariu user "coach":
-pentru ceea ce tine de squad managerul poate crea un squad pentru un meci slectand din bara de mai sus, se poate selecta formatia si jucatorii se aleg fie din lista de players fie din
pozitiile din formatie;
-squad ul va fi salvat cand vei completa squad ul cu cei 16 jucatori;
-daca un squad exista deja acesta poate vi sters sau inspectat;
-la player stats doar se pot vedea statisticile jucatorilor (ca antrenorul sa stie in functie de performante pe cine sa titularizeze);
-la contracte se pot crea sau edita (se va selecta salariu fie tastand fie din sageti are valoarea de baza 1000 va dauga/scadea 1000 la apasare, bonsul pe gol optional release claude optional, squad role important
si perioada contractului obligatorie);
-trainings (plan de antrenament editare/creare/stergere);
-nu se poate plasa in ziua unui meci sau dupa ce meciul a fost jucat se va trimte un toast de avertizare;
-user coach password coach1308;


Scenariu user "admin":
-gestionare user: adminul  poate modifica doar role ul userului sa l faca spre ex din fan-player sau din player-manager etc;
-gestionare tickets (creare/editare/stergere);
-gestionare produse (creare/editare/stergere);
-gestionare matches (creare/editare/stergere);
-unui meci nu i se poate modifica data peste a altui match sau peste a unui training;
-adminul se ocupa de modificarea playerStats urilor;
-adminul are o pagina de statistics unde poate vizualiza si filtra vanzarile de produse dupa mai multe criterii;
-username admin password admin1308;

