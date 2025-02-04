import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeService } from "src/modules/node/node.service";
import { NodeRepository } from "src/modules/node/node.repository";
import { Node } from "src/modules/node/entities/node.entity";

describe("NodeService", () => {
  let module: TestingModule;
  let service: NodeService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [TypeOrmModule.forFeature([Node])],
      providers: [NodeService, NodeRepository],
    }).compile();

    service = module.get<NodeService>(NodeService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
