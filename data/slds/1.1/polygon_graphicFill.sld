<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:se="http://www.opengis.net/se">
  <NamedLayer>
    <se:Name>Polygon Graphic Fill</se:Name>
    <UserStyle>
      <se:Name>Polygon Graphic Fill</se:Name>
      <se:FeatureTypeStyle>
        <se:Rule>
          <se:Name/>
          <se:PolygonSymbolizer>
            <se:Fill>
              <se:GraphicFill>
                <se:Graphic>
                  <se:Mark>
                    <se:WellKnownName>circle</se:WellKnownName>
                    <se:Fill>
                      <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                    </se:Fill>
                  </se:Mark>
                </se:Graphic>
              </se:GraphicFill>
              <se:SvgParameter name="fill">#000080</se:SvgParameter>
            </se:Fill>
            <se:Stroke>
              <se:SvgParameter name="stroke">#FFFFFF</se:SvgParameter>
              <se:SvgParameter name="stroke-width">2</se:SvgParameter>
              <se:SvgParameter name="stroke-dasharray">1 0</se:SvgParameter>
            </se:Stroke>
          </se:PolygonSymbolizer>
        </se:Rule>
      </se:FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
