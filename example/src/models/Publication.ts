import { Type } from 'recife';

@Type({ onlyHeritage: true })
class Publication {
  text!: String;
}

export default Publication;
