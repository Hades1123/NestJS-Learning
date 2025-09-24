import { Injectable } from "@nestjs/common";

@Injectable()
export class PremiumService {
    private readonly premiumUsers: string[] = [];
    add(user: string) {
        this.premiumUsers.push(user);
    }
    show() {
        this.premiumUsers.map(item => {
            console.log(item);
        })
    }
}