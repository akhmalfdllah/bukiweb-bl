import { Test, TestingModule } from "@nestjs/testing";
import { NodeController } from "src/modules/node/node.controller";
import { NodeService } from "src/modules/node/node.service";
import { NodeRepository } from "src/modules/node/node.repository";

describe("NodeController", () => {
  let module: TestingModule;
  let controller: NodeController;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [NodeController],
      providers: [NodeRepository, NodeService],
    }).compile();

    controller = module.get<NodeController>(NodeController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
