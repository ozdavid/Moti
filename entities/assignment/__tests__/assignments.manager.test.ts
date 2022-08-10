import moment from 'moment';
import { ascend, sort } from 'ramda';
import { Slot } from '../../slot';
import { User } from '../../user/user';
import { UserAssignmentsHistory } from '../history/dal';
import { AssignmentsManager } from '../manager';

describe("AssignmentsManager", () => {
    describe("calculateScores", () => {
        const manager = new AssignmentsManager({} as any, {} as any, {} as any, {} as any);
        describe("five users, all joined in the same month", () => {
            const users: User[] = [{ id: "u1", name: "hi", joinedAt: moment("2019-01-01").toDate() }, { id: "u2", name: "hi", joinedAt: moment("2019-01-01").toDate() }, { id: "u3", name: "hi", joinedAt: moment("2019-01-01").toDate() }, { id: "u4", name: "hi", joinedAt: moment("2019-01-01").toDate() }, { id: "u5", name: "hi", joinedAt: moment("2019-01-01").toDate() }];
            describe("users have different histories", () => {
                const usersAssignmentsHistories: UserAssignmentsHistory[] = [
                    { userId: users[0].id, assignedAt: [moment("2019-05-02").toDate()] },
                    { userId: users[1].id, assignedAt: [moment("2020-01-02").toDate(), moment("2020-01-01").toDate(), moment("2020-02-03").toDate()] },
                    { userId: users[2].id, assignedAt: [moment("2020-01-02").toDate(), moment("2020-02-14").toDate()] },
                    { userId: users[3].id, assignedAt: [moment("2020-01-02").toDate(), moment("2020-02-14").toDate(), moment("2020-02-15").toDate(), moment("2020-02-17").toDate()] },
                    { userId: users[4].id, assignedAt: [moment("2020-01-02").toDate(), moment("2020-02-14").toDate(), moment("2020-02-15").toDate(), moment("2020-02-17").toDate(), moment("2020-02-22").toDate()] },
                ];
                describe("two slots of same type", () => {
                    const slots: Slot[] = [
                        { index: 0, date: moment("2020-04-20").toDate(), capcacity: 2, type: "default" },
                        { index: 1, date: moment("2020-04-21").toDate(), capcacity: 2, type: "default" },
                    ];
                    test("users with more historical assignments get higher scores", () => {
                        const scores = manager.calculateScores(slots, usersAssignmentsHistories, users);
                        expect(scores.map(userScores => userScores.holiday)).toEqual(users.map(_ => 0));
                        expect(scores.map(userScores => userScores.weekend)).toEqual(users.map(_ => 0));
                        const sortedDefaultScores = sort(ascend(userScores => userScores.default), scores);
                        expect(sortedDefaultScores.map(({ userId }) => userId)).toEqual([
                            users[0].id,
                            users[2].id,
                            users[1].id,
                            users[3].id,
                            users[4].id
                        ]);
                    });
                });
            });
        });
        describe("five users, each joined in a different month", () => {
            const users: User[] = [{ id: "u1", name: "hi", joinedAt: moment("2019-04-01").toDate() }, { id: "u2", name: "hi", joinedAt: moment("2019-01-01").toDate() }, { id: "u3", name: "hi", joinedAt: moment("2019-03-01").toDate() }, { id: "u4", name: "hi", joinedAt: moment("2019-02-01").toDate() }, { id: "u5", name: "hi", joinedAt: moment("2019-05-01").toDate() }];
            describe("users have the same amount of historical assignments", () => {
                const usersAssignmentsHistories: UserAssignmentsHistory[] = [
                    { userId: users[0].id, assignedAt: [moment("2019-05-02").toDate()] },
                    { userId: users[1].id, assignedAt: [moment("2020-01-02").toDate()] },
                    { userId: users[2].id, assignedAt: [moment("2020-02-14").toDate()] },
                    { userId: users[3].id, assignedAt: [moment("2020-02-15").toDate(),] },
                    { userId: users[4].id, assignedAt: [moment("2020-02-17").toDate(),] },
                ];
                describe("two slots of same type", () => {
                    const slots: Slot[] = [
                        { index: 0, date: moment("2020-04-20").toDate(), capcacity: 2, type: "default" },
                        { index: 1, date: moment("2020-04-21").toDate(), capcacity: 2, type: "default" },
                    ];
                    test("older users higher scores", () => {
                        const scores = manager.calculateScores(slots, usersAssignmentsHistories, users);
                        expect(scores.map(userScores => userScores.holiday)).toEqual(users.map(_ => 0));
                        expect(scores.map(userScores => userScores.weekend)).toEqual(users.map(_ => 0));
                        const sortedDefaultScores = sort(ascend(userScores => userScores.default), scores);
                        expect(sortedDefaultScores.map(({ userId }) => userId)).toEqual([
                            users[0].id,
                            users[2].id,
                            users[1].id,
                            users[3].id,
                            users[4].id
                        ]);
                    });
                });
            });
        });
    });
});