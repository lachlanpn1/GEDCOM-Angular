export enum EventType {
  Birth,
  Death,
  Residence,
  Marriage,
  Other
}

export class Event {
  private _eventType : EventType;
  private _date : Date;
  private _location: String;
  private _description: String;

  constructor(eventType?: EventType, date?: Date, location?: String, description?: String) {
    if(eventType) {
      this._eventType = eventType;
    }
    if(date) {
      this._date = date;
    }
    if(location) {
      this._location = location;
    }
    if(description) {
      this._description = description;
    }
  }

  get eventType(): EventType {
    return this._eventType;
  }

  get date(): Date {
    return this._date;
  }

  get location(): String {
    return this._location;
  }

  get description() : String {
    return this._description;
  }

  set location(location: String) {
    this._location = location;
  }

  set date(date: Date) {
    this._date = date;
  }

  set eventType(eventType: EventType) {
    this._eventType = eventType;
  }

  set description(description: String) {
    this._description = description;
  }

}
