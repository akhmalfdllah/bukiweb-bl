import { EntitySubscriberInterface, EventSubscriber, UpdateEvent } from "typeorm";
import { Node } from "./entities/node.entity";
import { isNotMatch, Inherit } from "src/shared/utils/common.util";

@EventSubscriber()
export class NodeSubscriber implements EntitySubscriberInterface<Node> {
    listenTo() {
        return Node;
    }

    async afterUpdate(event: UpdateEvent<Node>) {
        try {
            const node =  event.entity as Node;
            const nodeRepository = event.manager.getRepository(Node);
            const before = Inherit.nodeToItem(event.databaseEntity as Node);
            const inherited = Inherit.nodeToItem(event.entity as Node);
            if (isNotMatch(before, inherited) && node.items) {
                await Promise.all (
                node.items.map(async(item) => await nodeRepository.save({...item, ...inherited})),

                )
            }
        }catch (error) {
            console.log("[subscriber-error] node after updated!")
        }
    }
}