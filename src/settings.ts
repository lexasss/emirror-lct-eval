export const SettingsName = 'emirrorquest';

export interface ISettings {
    ip: string;
    maxScore: number;
}

class Settings {
    value: ISettings;

    constructor() {
        const settingsStr = localStorage.getItem( SettingsName );
        if (settingsStr) {
            this.value = JSON.parse( settingsStr ) as ISettings;
        }
        else {
            this.value = {
                ip: '127.0.0.1',
                maxScore: 0,
            } as ISettings;
        }
    }

    save() {
        localStorage.setItem( SettingsName, JSON.stringify( this.value ));
    }
}

export const settings = new Settings();
